"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MoveHistoryProps {
  moves: string[]
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const movePairs = []
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Move History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {movePairs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No moves yet. Start playing!</div>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair) => (
                <div key={pair.moveNumber} className="flex items-center gap-2 text-sm">
                  <div className="w-8 text-muted-foreground font-mono">{pair.moveNumber}.</div>
                  <div className="w-16 font-mono">{pair.white}</div>
                  <div className="w-16 font-mono text-muted-foreground">{pair.black}</div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
