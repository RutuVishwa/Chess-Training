"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Chess } from "chess.js"

interface GameAnalysisProps {
  game: Chess
  moves: string[]
}

export function GameAnalysis({ game, moves }: GameAnalysisProps) {
  const materialCount = () => {
    const board = game.board()
    let whiteValue = 0
    let blackValue = 0

    const pieceValues: { [key: string]: number } = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
    }

    board.forEach((row) => {
      row.forEach((square) => {
        if (square) {
          const value = pieceValues[square.type]
          if (square.color === "w") {
            whiteValue += value
          } else {
            blackValue += value
          }
        }
      })
    })

    return { white: whiteValue, black: blackValue }
  }

  const material = materialCount()
  const totalMaterial = material.white + material.black
  const whiteAdvantage = material.white - material.black

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-200">Material Balance</span>
          <Badge 
            variant={whiteAdvantage > 0 ? "default" : whiteAdvantage < 0 ? "destructive" : "secondary"}
            className="font-mono"
          >
            {whiteAdvantage > 0 ? `+${whiteAdvantage}` : whiteAdvantage < 0 ? whiteAdvantage : "Equal"}
          </Badge>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-slate-300">
            <span>White: {material.white}</span>
            <span>Black: {material.black}</span>
          </div>
          <Progress value={totalMaterial > 0 ? (material.white / totalMaterial) * 100 : 50} className="h-2" />
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-200 mb-2">Game Statistics</div>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Total Moves:</span>
            <span className="font-mono">{moves.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Turn:</span>
            <span className="font-mono">{game.turn() === "w" ? "White" : "Black"}</span>
          </div>
          <div className="flex justify-between">
            <span>In Check:</span>
            <span className="font-mono">{game.isCheck() ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-200 mb-2">Position Info</div>
        <div className="text-xs bg-slate-700/50 p-2 rounded border border-slate-600">
          <div className="font-mono text-slate-300 break-all">
            {game.fen().split(" ")[0]}
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-200 mb-2">Training Tips</div>
        <div className="text-sm text-slate-400 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Control the center squares</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Develop pieces before attacking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Keep your king safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Look for tactical opportunities</span>
          </div>
        </div>
      </div>
    </div>
  )
}
