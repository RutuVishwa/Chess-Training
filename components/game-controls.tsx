"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Play, Flag } from "lucide-react"

interface GameControlsProps {
  onReset: () => void
  onUndo: () => void
  canUndo: boolean
  gameStatus: string
}

export function GameControls({ onReset, onUndo, canUndo, gameStatus }: GameControlsProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Button onClick={onReset} variant="outline" className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            New Game
          </Button>
          <Button onClick={onUndo} disabled={!canUndo} variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo
          </Button>
        </div>

        {gameStatus && (
          <div className="text-center p-3 bg-slate-100 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              {gameStatus.includes("Checkmate") && <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />}
              <Badge
                variant={
                  gameStatus.includes("Checkmate")
                    ? "destructive"
                    : gameStatus.includes("Check")
                      ? "default"
                      : "secondary"
                }
                className="text-sm sm:text-lg px-2 sm:px-3 py-1"
              >
                {gameStatus}
              </Badge>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs sm:text-sm text-muted-foreground space-y-1">
          <div>• Tap a piece to select it</div>
          <div>• Tap a highlighted square to move</div>
          <div>• Drag and drop pieces to move</div>
        </div>
      </CardContent>
    </Card>
  )
}
