"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Chess, Square } from "chess.js"

interface ChessBoardProps {
  position: string
  onSquareClick: (square: string) => void
  selectedSquare: string | null
  lastMove?: string
  isPuzzleMode?: boolean
}

type MoveQuality = 'best' | 'average' | 'worst'

interface MoveEvaluation {
  square: string
  quality: MoveQuality
}

interface GameOverPopupProps {
  winner: 'white' | 'black' | 'draw'
  onClose: () => void
}

interface ChessMove {
  to: string
  flags: string
}

const pieceSymbols: { [key: string]: string } = {
  wK: "♔",
  wQ: "♕",
  wR: "♖",
  wB: "♗",
  wN: "♘",
  wP: "♙",
  bK: "♚",
  bQ: "♛",
  bR: "♜",
  bB: "♝",
  bN: "♞",
  bP: "♟",
}

// Add new components at the top
const MoveLegend = () => (
  <div className="absolute top-2 right-2 bg-slate-900/90 p-2 rounded-lg shadow-lg text-xs sm:text-sm space-y-1 text-white border border-slate-700">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <span>Best Move</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
      <span>Good Move</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <span>Risky Move</span>
    </div>
  </div>
)

const GameOverPopup = ({ winner, onClose }: GameOverPopupProps) => (
  <div className="fixed inset-0 bg-slate-900/95 flex items-center justify-center z-50">
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        {winner === 'draw' ? "Game Draw!" : `${winner === 'white' ? 'White' : 'Black'} Wins!`}
      </h2>
      <p className="text-slate-300 mb-6 text-center">
        {winner === 'draw' 
          ? "The game ended in a draw."
          : `Congratulations to ${winner === 'white' ? 'White' : 'Black'} player!`}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
)

export function ChessBoard({ position, onSquareClick, selectedSquare, lastMove, isPuzzleMode = false }: ChessBoardProps) {
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null)
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null)
  const [evaluatedMoves, setEvaluatedMoves] = useState<MoveEvaluation[]>([])
  const [showGameOver, setShowGameOver] = useState(false)
  const [gameWinner, setGameWinner] = useState<'white' | 'black' | 'draw' | null>(null)

  // Parse FEN to get board position
  const fenParts = position.split(" ")
  const boardFen = fenParts[0]
  const currentTurn = fenParts[1]
  const rows = boardFen.split("/")

  const board: (string | null)[][] = []

  rows.forEach((row) => {
    const boardRow: (string | null)[] = []
    for (const char of row) {
      if (isNaN(Number.parseInt(char))) {
        // It's a piece
        const color = char === char.toUpperCase() ? "w" : "b"
        const piece = char.toUpperCase()
        boardRow.push(color + piece)
      } else {
        // It's a number of empty squares
        const emptySquares = Number.parseInt(char)
        for (let i = 0; i < emptySquares; i++) {
          boardRow.push(null)
        }
      }
    }
    board.push(boardRow)
  })

  const getSquareName = (row: number, col: number) => {
    const files = "abcdefgh"
    const ranks = "87654321"
    return files[col] + ranks[row]
  }

  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0
  }

  const isValidMove = (from: string, to: string): boolean => {
    if (!from) return false

    try {
      const gameCopy = new Chess(position)
      const move = gameCopy.move({ from, to, promotion: "q" })
      return !!move
    } catch (error) {
      return false
    }
  }

  const getValidMoves = (square: string): string[] => {
    try {
      const gameCopy = new Chess(position)
      const moves = gameCopy.moves({ square: square as Square, verbose: true })
      return moves.map((move) => move.to)
    } catch (error) {
      return []
    }
  }

  const validMoves = selectedSquare ? getValidMoves(selectedSquare) : []

  // Function to evaluate move quality
  const evaluateMove = (from: string, to: string): MoveQuality => {
    const gameCopy = new Chess(position)
    
    try {
      // Get all possible moves for the selected piece
      const moves = gameCopy.moves({ square: from as Square, verbose: true })
      
      // Basic move evaluation criteria
      // 1. Captures are generally good moves
      // 2. Center control (e4, d4, e5, d5) is good
      // 3. Moving to protected squares is good
      // 4. Moving to squares under attack is bad
      
      const targetSquare = to as Square
      const move = moves.find(m => m.to === targetSquare)
      
      if (!move) return 'worst'
      
      const centerSquares = ['e4', 'd4', 'e5', 'd5']
      const isCapture = move.flags.includes('c')
      const isToCenter = centerSquares.includes(targetSquare)
      
      // Make the move to analyze position
      gameCopy.move(move)
      
      // Check if the move puts piece under attack
      const isUnderAttack = gameCopy.isAttacked(targetSquare, gameCopy.turn())
      
      // Evaluate move quality
      if (isCapture || (isToCenter && !isUnderAttack)) {
        return 'best'
      } else if (isUnderAttack) {
        return 'worst'
      } else {
        return 'average'
      }
    } catch {
      return 'worst'
    }
  }

  // Update evaluatedMoves when a piece is selected
  useEffect(() => {
    if (selectedSquare) {
      const gameCopy = new Chess(position)
      const moves = gameCopy.moves({ square: selectedSquare as Square, verbose: true })
      
      const evaluations: MoveEvaluation[] = moves.map(move => ({
        square: move.to,
        quality: evaluateMove(selectedSquare, move.to)
      }))
      
      setEvaluatedMoves(evaluations)
    } else {
      setEvaluatedMoves([])
    }
  }, [selectedSquare, position])

  // Add effect to check for game over - only in non-puzzle mode
  useEffect(() => {
    if (!isPuzzleMode) {
      const game = new Chess(position)
      if (game.isGameOver()) {
        let winner: 'white' | 'black' | 'draw'
        if (game.isDraw()) {
          winner = 'draw'
        } else {
          winner = game.turn() === 'b' ? 'white' : 'black'
        }
        setGameWinner(winner)
        setShowGameOver(true)
      }
    }
  }, [position, isPuzzleMode])

  return (
    <div className="w-full bg-slate-900">
      <MoveLegend />
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          <div className="w-full h-full border-4 border-[#8B4513] rounded-lg overflow-hidden">
            <div className="w-full h-full grid grid-cols-8">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const squareName = getSquareName(rowIndex, colIndex)
                  const isLight = isLightSquare(rowIndex, colIndex)
                  const isSelected = selectedSquare === squareName
                  const isValidTarget = validMoves.includes(squareName)
                  const isHovered = hoveredSquare === squareName
                  const hasMovablePiece = piece && piece[0] === currentTurn
                  
                  const moveEval = evaluatedMoves.find(m => m.square === squareName)
                  
                  return (
                    <div
                      key={squareName}
                      className={cn(
                        "relative w-full h-0 pt-[100%]",
                        isLight ? "bg-[#E8D0AA]" : "bg-[#8B4513]",
                        isSelected && "ring-2 ring-blue-400/50 ring-inset",
                        isValidTarget && "ring-2 ring-green-400/50 ring-inset",
                        isHovered && hasMovablePiece && "brightness-110",
                        "cursor-pointer"
                      )}
                      onClick={() => onSquareClick(squareName)}
                      onMouseEnter={() => setHoveredSquare(squareName)}
                      onMouseLeave={() => setHoveredSquare(null)}
                    >
                      {piece && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={cn(
                            "transform text-3xl sm:text-4xl select-none drop-shadow-md",
                            piece[0] === "w" ? "text-white" : "text-slate-900"
                          )}>
                            {pieceSymbols[piece]}
                          </span>
                        </div>
                      )}
                      {moveEval && (
                        <div className={cn(
                          "absolute w-2.5 h-2.5 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-75",
                          moveEval.quality === 'best' ? "bg-blue-400" :
                          moveEval.quality === 'average' ? "bg-emerald-400" :
                          "bg-red-400"
                        )} />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
      {!isPuzzleMode && showGameOver && gameWinner && (
        <GameOverPopup winner={gameWinner} onClose={() => setShowGameOver(false)} />
      )}
    </div>
  )
}
