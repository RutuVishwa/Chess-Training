"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { Chess } from "chess.js"
import { ChessBoard } from "@/components/chess-board"
import { GameControls } from "@/components/game-controls"
import { MoveHistory } from "@/components/move-history"
import { TrainingModes } from "@/components/training-modes"
import { GameAnalysis } from "@/components/game-analysis"
import { PuzzleTrainer } from "@/components/puzzle-trainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIGame } from "@/components/ai-game"
import { Brain, Target, Trophy } from "lucide-react"

// Create a client component for the main content
function TrainingContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'puzzles'
  
  const [game, setGame] = useState(new Chess())
  const [gameHistory, setGameHistory] = useState<string[]>([])
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [trainingMode, setTrainingMode] = useState<"free" | "computer" | "puzzle">("free")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [gameStartTime, setGameStartTime] = useState<number>(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [puzzlesSolved, setPuzzlesSolved] = useState(0)
  const [rating, setRating] = useState(1200)

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("chess_stats")
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setGamesPlayed(stats.gamesPlayed || 0)
      setPuzzlesSolved(stats.puzzlesSolved || 0)
      setRating(stats.rating || 1200)
    }
  }, [])

  // Save stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "chess_stats",
      JSON.stringify({
        gamesPlayed,
        puzzlesSolved,
        rating,
      }),
    )
  }, [gamesPlayed, puzzlesSolved, rating])

  const makeMove = (from: string, to: string) => {
    const gameCopy = new Chess(game.fen())

    try {
      // Check if the move is valid
      const move = gameCopy.move({
        from,
        to,
        promotion: "q", // Always promote to queen for simplicity
      })

      if (move) {
        setGame(gameCopy)
        setGameHistory((prev) => [...prev, move.san])
        setSelectedSquare(null)

        // If playing against computer, make computer move after a delay
        if (trainingMode === "computer" && !gameCopy.isGameOver()) {
          setTimeout(() => makeComputerMove(gameCopy), 500)
        }

        // Check if game is over
        if (gameCopy.isGameOver()) {
          handleGameOver(gameCopy)
        }
      }
    } catch (error) {
      console.log("Invalid move")
      // Clear selection on invalid move
      setSelectedSquare(null)
    }
  }

  const makeComputerMove = (currentGame: Chess) => {
    const moves = currentGame.moves()
    if (moves.length === 0) return

    // Enhanced computer move selection based on difficulty
    let selectedMove: string

    if (difficulty === "easy") {
      // Random move for easy difficulty
      selectedMove = moves[Math.floor(Math.random() * moves.length)]
    } else if (difficulty === "medium") {
      // Prefer captures and checks for medium difficulty
      const captures = moves.filter((move) => move.includes("x"))
      const checks = moves.filter((move) => move.includes("+"))
      const goodMoves = [...captures, ...checks]

      if (goodMoves.length > 0 && Math.random() > 0.3) {
        selectedMove = goodMoves[Math.floor(Math.random() * goodMoves.length)]
      } else {
        selectedMove = moves[Math.floor(Math.random() * moves.length)]
      }
    } else {
      // Hard difficulty - prefer captures, checks, and avoid obvious blunders
      const captures = moves.filter((move) => move.includes("x"))
      const checks = moves.filter((move) => move.includes("+"))
      const goodMoves = [...captures, ...checks]

      if (goodMoves.length > 0 && Math.random() > 0.2) {
        selectedMove = goodMoves[Math.floor(Math.random() * goodMoves.length)]
      } else {
        selectedMove = moves[Math.floor(Math.random() * moves.length)]
      }
    }

    const move = currentGame.move(selectedMove)

    if (move) {
      // Update game state while preserving move history
      const newGame = new Chess(currentGame.fen())
      setGame(newGame)
      setGameHistory((prev) => [...prev, move.san])

      // Check if game is over after computer move
      if (currentGame.isGameOver()) {
        handleGameOver(currentGame)
      }
    }
  }

  const handleGameOver = (finalGame: Chess) => {
    // Update stats
    setGamesPlayed((prev) => prev + 1)

    // Update rating based on result
    if (finalGame.isCheckmate()) {
      const playerWon = finalGame.turn() === "b" // If black to move, white won
      if (playerWon) {
        setRating((prev) => prev + 10)
      } else {
        setRating((prev) => Math.max(prev - 10, 800))
      }
    }
  }

  const resetGame = () => {
    setGame(new Chess())
    setGameHistory([])
    setSelectedSquare(null)
    setGameStartTime(Date.now())
  }

  const undoMove = () => {
    if (gameHistory.length === 0) return

    const gameCopy = new Chess(game.fen())
    gameCopy.undo()

    // If playing against computer, undo computer's move too
    if (trainingMode === "computer" && gameHistory.length > 1) {
      gameCopy.undo()
      setGameHistory((prev) => prev.slice(0, -2))
    } else {
      setGameHistory((prev) => prev.slice(0, -1))
    }

    setGame(gameCopy)
    setSelectedSquare(null)
  }

  const handlePuzzleSolved = () => {
    setPuzzlesSolved((prev) => prev + 1)
    setRating((prev) => prev + 5)
  }

  const handleGameCompleted = (result: "win" | "loss" | "draw") => {
    setGamesPlayed(prev => prev + 1)
    // Simple rating adjustment based on game result
    setRating(prev => {
      const adjustment = result === "win" ? 15 
                      : result === "loss" ? -10 
                      : 2
      return prev + adjustment
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Chess-themed background pattern */}
      <div className="absolute inset-0 bg-[url('/chess-pattern.png')] opacity-5"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-gradient-slow"></div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-slate-400">Rating</div>
                <div className="text-xl font-bold text-white">{rating}</div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-slate-400">Games Played</div>
                <div className="text-xl font-bold text-white">{gamesPlayed}</div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-slate-400">Puzzles Solved</div>
                <div className="text-xl font-bold text-white">{puzzlesSolved}</div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="puzzles">
          <div className="flex flex-col space-y-4">
            <TabsList>
              <TabsTrigger value="ai">
                <Brain className="w-4 h-4 mr-2" />
                vs AI
              </TabsTrigger>
              <TabsTrigger value="puzzles">
                <Target className="w-4 h-4 mr-2" />
                Puzzles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai">
              <AIGame onGameComplete={handleGameCompleted} />
            </TabsContent>

            <TabsContent value="puzzles">
              <PuzzleTrainer onPuzzleSolved={handlePuzzleSolved} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function TrainingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 flex items-center justify-center">
        <div className="text-slate-600">Loading training session...</div>
      </div>
    }>
      <TrainingContent />
    </Suspense>
  )
} 