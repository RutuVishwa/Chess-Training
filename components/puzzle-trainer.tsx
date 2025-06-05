"use client"

import { useState, useEffect } from "react"
import { Chess } from "chess.js"
import { ChessBoard } from "@/components/chess-board"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, RotateCcw, CheckCircle, XCircle, Clock, Target } from "lucide-react"
<<<<<<< HEAD
import { cn } from "@/lib/utils"
=======
>>>>>>> 85a862c625de974b52fe3668eedb442715d00c31

// Local puzzles data
const localPuzzles = [
  {
    id: "1",
    title: "Back Rank Mate",
    description: "Find the winning move that delivers checkmate",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: ["Re8#"],
    theme: "checkmate",
    difficulty: "beginner",
    rating: 1000,
  },
  {
    id: "2",
    title: "Knight Fork",
    description: "Use your knight to attack two pieces at once",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Ng5", "d6", "Nxf7"],
    theme: "fork",
    difficulty: "intermediate",
    rating: 1300,
  },
  {
    id: "3",
    title: "Pin the Queen",
    description: "Pin the opponent's queen to their king",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Bg5"],
    theme: "pin",
    difficulty: "beginner",
    rating: 1100,
  },
  {
    id: "4",
    title: "Skewer Attack",
    description: "Force the king to move and win material",
    fen: "4k3/8/8/8/8/8/4R3/4K3 w - - 0 1",
    solution: ["Re8+", "Kf7", "Re7+"],
    theme: "skewer",
    difficulty: "intermediate",
    rating: 1250,
  },
  {
    id: "5",
    title: "Smothered Mate",
    description: "Deliver checkmate with a knight",
    fen: "6rk/6pp/8/8/8/8/5N2/6K1 w - - 0 1",
    solution: ["Nf7#"],
    theme: "checkmate",
    difficulty: "advanced",
    rating: 1600,
  },
]

interface PuzzleTrainerProps {
  onPuzzleSolved: () => void
}

interface PuzzleType {
  id: string;
  title: string;
  description: string;
  fen: string;
  solution: string[];
  theme: string;
  difficulty: string;
  rating: number;
}

export function PuzzleTrainer({ onPuzzleSolved }: PuzzleTrainerProps) {
  const [puzzles, setPuzzles] = useState<PuzzleType[]>(localPuzzles)
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType | null>(null)
  const [game, setGame] = useState<Chess | null>(null)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [solutionIndex, setSolutionIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [failed, setFailed] = useState(false)
  const [difficulty, setDifficulty] = useState("beginner")
  const [theme, setTheme] = useState("tactics")
<<<<<<< HEAD
  const [loading, setLoading] = useState(true)
=======
  const [loading, setLoading] = useState(false)
>>>>>>> 85a862c625de974b52fe3668eedb442715d00c31
  const [startTime, setStartTime] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [message, setMessage] = useState<string>("")
  const [showHint, setShowHint] = useState(false)

<<<<<<< HEAD
  // Initialize first puzzle
  useEffect(() => {
    if (puzzles.length > 0) {
      const firstPuzzle = puzzles[0]
      setCurrentPuzzle(firstPuzzle)
      setGame(new Chess(firstPuzzle.fen))
      setStartTime(Date.now())
      setMessage("Find the best move!")
      setLoading(false)
    }
  }, [])

=======
>>>>>>> 85a862c625de974b52fe3668eedb442715d00c31
  useEffect(() => {
    filterPuzzles()
  }, [difficulty, theme])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (startTime && !solved && !failed) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [startTime, solved, failed])

  const filterPuzzles = () => {
    setLoading(true)
    try {
      // Filter puzzles based on difficulty and theme
      let filtered = [...localPuzzles]

      if (difficulty !== "all") {
        filtered = filtered.filter((p) => p.difficulty === difficulty)
      }

      if (theme !== "tactics") {
        filtered = filtered.filter((p) => p.theme === theme)
      }

      // If no puzzles match the criteria, use all puzzles
      if (filtered.length === 0) {
        filtered = localPuzzles
      }

      setPuzzles(filtered)
      if (filtered.length > 0) {
        loadPuzzle(filtered[0])
      }
    } catch (error) {
      console.error("Failed to filter puzzles:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPuzzle = (puzzle: any) => {
    setCurrentPuzzle(puzzle)
    setGame(new Chess(puzzle.fen))
    setSolutionIndex(0)
    setSolved(false)
    setFailed(false)
    setSelectedSquare(null)
    setStartTime(Date.now())
    setElapsedTime(0)
    setMessage("Find the best move!")
    setShowHint(false)
  }

  const handleSquareClick = (square: string) => {
    if (!game || !currentPuzzle) return;

    if (selectedSquare) {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        })

        if (move) {
          const expectedMove = currentPuzzle.solution[solutionIndex]
          if (move.san === expectedMove) {
            const newGame = new Chess(game.fen())
            setGame(newGame)
            setSolutionIndex(solutionIndex + 1)

            // Check if puzzle is complete
            if (solutionIndex + 1 >= currentPuzzle.solution.length) {
              setSolved(true)
              onPuzzleSolved()
              setMessage("Correct! Well done!")
              setTimeout(() => {
                const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id)
                const nextPuzzle = puzzles[(currentIndex + 1) % puzzles.length]
                setCurrentPuzzle(nextPuzzle)
              }, 2000)
            }
          } else {
            setFailed(true)
            setMessage("Incorrect. Try again!")
            // Undo the move
            game.undo()
            setGame(new Chess(game.fen()))
          }
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

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      {/* Puzzle Controls and Instructions */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Instructions */}
        <div className="p-4 border-b border-slate-700/50">
          {currentPuzzle && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-white">{currentPuzzle.title}</h3>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                    {currentPuzzle.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
                    {currentPuzzle.theme}
                  </Badge>
                </div>
              </div>
              <p className="text-slate-300 mb-2">{currentPuzzle.description}</p>
              {message && (
                <div className={cn(
                  "text-sm font-medium",
                  solved ? "text-green-400" : 
                  failed ? "text-red-400" : 
                  "text-blue-400"
                )}>
                  {message}
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  {formatTime(elapsedTime)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setShowHint(true)}
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Show Hint
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="p-4">
=======
      {/* Puzzle Controls */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-4 sm:p-6">
>>>>>>> 85a862c625de974b52fe3668eedb442715d00c31
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tactics">All Tactics</SelectItem>
                  <SelectItem value="checkmate">Checkmate</SelectItem>
                  <SelectItem value="fork">Fork</SelectItem>
                  <SelectItem value="pin">Pin</SelectItem>
                  <SelectItem value="skewer">Skewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
<<<<<<< HEAD

        {/* Chess Board */}
        <div className="p-6 pt-0">
          <div className="flex justify-center mb-6">
            <div className="rounded-xl overflow-hidden shadow-2xl w-full max-w-[600px]">
              {loading ? (
                <div className="aspect-square bg-slate-800 animate-pulse" />
              ) : game && (
                <ChessBoard
                  position={game.fen()}
                  onSquareClick={handleSquareClick}
                  selectedSquare={selectedSquare}
                  isPuzzleMode={true}
                />
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => loadPuzzle(currentPuzzle)} 
              variant="outline"
              className="bg-slate-700/50 hover:bg-slate-600/50 text-white border-slate-600 hover:border-slate-500 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button 
              onClick={() => {
                if (!currentPuzzle) return;
                const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id)
                const nextPuzzle = puzzles[(currentIndex + 1) % puzzles.length]
                loadPuzzle(nextPuzzle)
              }} 
              disabled={puzzles.length <= 1}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            >
              Next Puzzle
            </Button>
          </div>
        </div>
      </div>
=======
      </div>

      {/* Current Puzzle */}
      {currentPuzzle && game && (
        <div className="relative">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg">
            {/* Puzzle Header - Floating at the top */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 rounded-full shadow-lg flex items-center gap-3">
                <div className="text-white font-medium">{currentPuzzle.title}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {currentPuzzle.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {currentPuzzle.theme}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-6 pt-8">
              {/* Chess Board */}
              <div className="flex justify-center mb-6">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <ChessBoard
                    position={game.fen()}
                    onSquareClick={handleSquareClick}
                    selectedSquare={selectedSquare}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => loadPuzzle(currentPuzzle)} 
                  variant="outline"
                  className="bg-slate-700/50 hover:bg-slate-600/50 text-white border-slate-600 hover:border-slate-500 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button 
                  onClick={() => {
                    if (!currentPuzzle) return;
                    const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id)
                    const nextPuzzle = puzzles[(currentIndex + 1) % puzzles.length]
                    setCurrentPuzzle(nextPuzzle)
                  }} 
                  disabled={puzzles.length <= 1}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                >
                  Next Puzzle
                </Button>
              </div>
            </div>
          </div>

          {/* Floating Instructions Panel */}
          <div className="absolute -bottom-4 left-6 right-6 z-10">
            <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-300 mb-1">Instructions</div>
                  <p className="text-sm text-slate-400">{currentPuzzle.description}</p>
                </div>

                <div className="flex items-center gap-4 border-l border-slate-700/50 pl-4">
                  {/* Timer */}
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">{formatTime(elapsedTime)}</span>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-400">
                      {solutionIndex} / {currentPuzzle.solution.length}
                    </div>
                    <div className="w-20">
                      <Progress value={(solutionIndex / currentPuzzle.solution.length) * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Hint Button */}
                  <Button
                    onClick={() => setShowHint(!showHint)}
                    variant="outline"
                    size="sm"
                    className="bg-slate-700/50 hover:bg-slate-600/50 text-white border-slate-600 hover:border-slate-500"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>
              </div>

              {/* Status Messages */}
              {(solved || failed) && (
                <div className="mt-3">
                  {solved && (
                    <Alert className="bg-green-500/20 border-green-500/30">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-300">
                        Puzzle solved in {formatTime(elapsedTime)}! Great job!
                      </AlertDescription>
                    </Alert>
                  )}

                  {failed && (
                    <Alert variant="destructive" className="bg-red-500/20 border-red-500/30">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        Incorrect move. Try again or reset the puzzle.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Hint Panel */}
              {showHint && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-blue-300">
                    <div className="font-medium mb-1">Hint:</div>
                    Look for a forcing move that creates a tactical opportunity.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
>>>>>>> 85a862c625de974b52fe3668eedb442715d00c31
    </div>
  )
}
