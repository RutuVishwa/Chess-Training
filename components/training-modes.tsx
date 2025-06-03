"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Puzzle } from "lucide-react"

interface TrainingModesProps {
  currentMode: "free" | "computer" | "puzzle"
  onModeChange: (mode: "free" | "computer" | "puzzle") => void
  difficulty: "easy" | "medium" | "hard"
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard") => void
  onStartTraining: () => void
}

export function TrainingModes({
  currentMode,
  onModeChange,
  difficulty,
  onDifficultyChange,
  onStartTraining,
}: TrainingModesProps) {
  const modes = [
    {
      id: "free" as const,
      name: "Free Play",
      description: "Practice moves freely",
      icon: Users,
    },
    {
      id: "computer" as const,
      name: "vs Computer",
      description: "Play against AI",
      icon: Brain,
    },
    {
      id: "puzzle" as const,
      name: "Puzzles",
      description: "Solve chess puzzles",
      icon: Puzzle,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Training Modes</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 space-y-4">
        <div className="space-y-2">
          {modes.map((mode) => {
            const Icon = mode.icon
            return (
              <div
                key={mode.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentMode === mode.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => onModeChange(mode.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base">{mode.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{mode.description}</div>
                  </div>
                  {currentMode === mode.id && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {currentMode === "computer" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty Level</label>
            <Select value={difficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={onStartTraining} className="w-full">
          Start Training
        </Button>

        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
          <div>
            • <strong>Free Play:</strong> Practice moves and positions
          </div>
          <div>
            • <strong>vs Computer:</strong> Test your skills against AI
          </div>
          <div>
            • <strong>Puzzles:</strong> Solve tactical problems
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
