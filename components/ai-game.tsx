"use client"

import { useState, useEffect } from "react"
import { Chess } from "chess.js"
import { ChessBoard } from "@/components/chess-board"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, RotateCcw, ChevronRight, BookOpen, AlertTriangle, CheckCircle } from "lucide-react"

interface GameAnalysis {
  move: string
  evaluation: number
  type: "blunder" | "mistake" | "inaccuracy" | "good" | "excellent" | "book"
  suggestion?: string
  opening?: string
}

interface AIGameProps {
  onGameComplete: (result: "win" | "loss" | "draw") => void
}

export function AIGame({ onGameComplete }: AIGameProps) {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [aiRating, setAiRating] = useState(1500)
  const [isThinking, setIsThinking] = useState(false)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [analysis, setAnalysis] = useState<GameAnalysis[]>([])
  const [currentOpening, setCurrentOpening] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (game.isGameOver()) {
      analyzeGame()
    }
  }, [game])

  const handleSquareClick = (square: string) => {
    if (isThinking || game.isGameOver()) return

    if (selectedSquare) {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        })

        if (move) {
          const newGame = new Chess(game.fen())
          setGame(newGame)
          const newHistory = [...moveHistory, move.san]
          setMoveHistory(newHistory)
          updateOpening(newGame)
          makeAiMove(newGame)
        }
      } catch (e) {
        console.log('Invalid move')
      }
      setSelectedSquare(null)
    } else {
      const piece = game.get(square as any)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
      }
    }
  }

  const makeAiMove = async (currentGame: Chess) => {
    setIsThinking(true)
    setMessage("AI is thinking...")

    // Simulate AI thinking time based on rating
    const thinkingTime = Math.max(500, Math.min(2000, aiRating / 2))
    
    setTimeout(() => {
      try {
        const moves = currentGame.moves({ verbose: true })
        if (moves.length > 0) {
          // AI move selection logic based on rating
          let selectedMove
          if (aiRating < 1000) {
            // Lower rated AI makes more random moves
            selectedMove = moves[Math.floor(Math.random() * moves.length)]
          } else if (aiRating < 1500) {
            // Mid-rated AI prefers captures and checks
            const priorityMoves = moves.filter(m => m.flags.includes('c') || m.flags.includes('e') || m.san.includes('+'))
            selectedMove = priorityMoves.length > 0 
              ? priorityMoves[Math.floor(Math.random() * priorityMoves.length)]
              : moves[Math.floor(Math.random() * moves.length)]
          } else {
            // Higher rated AI uses more sophisticated evaluation (simplified for demo)
            selectedMove = moves[Math.floor(Math.random() * Math.min(3, moves.length))]
          }

          const newGame = new Chess(currentGame.fen())
          newGame.move(selectedMove)
          setGame(newGame)
          const newHistory = [...moveHistory, selectedMove.san]
          setMoveHistory(newHistory)
          updateOpening(newGame)
          analyzeMoves(newGame, selectedMove.san)
        }
      } catch (e) {
        console.error('AI move error:', e)
      }
      setIsThinking(false)
      setMessage("")
    }, thinkingTime)
  }

  const updateOpening = (currentGame: Chess) => {
    // Simplified opening detection (would use a real opening database in production)
    const moves = currentGame.history().length
    if (moves <= 10) {
      const commonOpenings: { [key: string]: string[] } = {
        "Sicilian Defense": ["e4", "c5"],
        "French Defense": ["e4", "e6"],
        "Ruy Lopez": ["e4", "e5", "Nf3", "Nc6", "Bb5"],
        "Queen's Gambit": ["d4", "d5", "c4"],
        "King's Indian": ["d4", "Nf6", "c4", "g6"]
      }

      const history = currentGame.history()
      for (const [name, moves] of Object.entries(commonOpenings)) {
        if (moves.every((move, i) => history[i] === move)) {
          setCurrentOpening(name)
          return
        }
      }
    }
  }

  const analyzeMoves = (currentGame: Chess, lastMove: string) => {
    // Simplified move analysis (would use a real chess engine in production)
    const randomEval = Math.random() * 2 - 1 // Random evaluation between -1 and 1
    let moveType: GameAnalysis["type"]
    
    if (randomEval < -0.8) moveType = "blunder"
    else if (randomEval < -0.5) moveType = "mistake"
    else if (randomEval < -0.2) moveType = "inaccuracy"
    else if (randomEval < 0.5) moveType = "good"
    else moveType = "excellent"

    const newAnalysis: GameAnalysis = {
      move: lastMove,
      evaluation: randomEval,
      type: moveType,
      suggestion: moveType === "blunder" ? "Consider developing pieces first" : undefined
    }

    setAnalysis(prevAnalysis => [...prevAnalysis, newAnalysis])
  }

  const analyzeGame = () => {
    let result: "win" | "loss" | "draw" = "draw"
    
    if (game.isCheckmate()) {
      result = game.turn() === 'b' ? "win" : "loss"
    } else if (game.isDraw()) {
      result = "draw"
    }
    
    onGameComplete(result)
    setMessage(`${result.charAt(0).toUpperCase() + result.slice(1)}! Click 'New Game' to play again.`)
  }

  const resetGame = () => {
    setGame(new Chess())
    setSelectedSquare(null)
    setMoveHistory([])
    setAnalysis([])
    setCurrentOpening("")
    setMessage("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main game board */}
      <Card className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6">
          <div className="max-w-[600px] mx-auto">
            <ChessBoard
              position={game.fen()}
              onSquareClick={handleSquareClick}
              selectedSquare={selectedSquare}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              onClick={resetGame}
              variant="outline"
              className="bg-slate-700/50 hover:bg-slate-600/50 text-white border-slate-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>

            <div className="flex-1 flex items-center gap-4">
              <Brain className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <Slider
                  value={[aiRating]}
                  onValueChange={(value) => setAiRating(value[0])}
                  min={500}
                  max={2500}
                  step={100}
                  className="w-full"
                />
              </div>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                ELO {aiRating}
              </Badge>
            </div>
          </div>

          {message && (
            <Alert className="mt-4 bg-slate-700/50 border-slate-600">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Game analysis sidebar */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6">
          {currentOpening && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Opening</span>
              </div>
              <div className="text-white">{currentOpening}</div>
            </div>
          )}

          <div className="space-y-4">
            {moveHistory.map((move, index) => {
              const moveAnalysis = analysis[index]
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30">
                  <div className="text-slate-400 text-sm">
                    {Math.floor(index / 2) + 1}.{index % 2 === 0 ? "" : ".."}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{move}</span>
                      {moveAnalysis && (
                        <Badge 
                          variant="outline" 
                          className={
                            moveAnalysis.type === "blunder" ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : moveAnalysis.type === "mistake" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                            : moveAnalysis.type === "inaccuracy" ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                            : moveAnalysis.type === "good" ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          }
                        >
                          {moveAnalysis.type}
                        </Badge>
                      )}
                    </div>
                    {moveAnalysis?.suggestion && (
                      <div className="mt-2 flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{moveAnalysis.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {moveHistory.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              Make your first move to start the game
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 