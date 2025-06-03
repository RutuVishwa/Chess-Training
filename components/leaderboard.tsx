"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Target, GamepadIcon } from "lucide-react"

interface LeaderboardProps {
  token: string
}

export function Leaderboard({ token }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState("rating")

  useEffect(() => {
    fetchLeaderboard(type)
  }, [type])

  const fetchLeaderboard = async (leaderboardType: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/leaderboard?type=${leaderboardType}&limit=50`)
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={type} onValueChange={setType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rating" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Rating
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <GamepadIcon className="h-4 w-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="puzzles" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Puzzles
            </TabsTrigger>
          </TabsList>

          <TabsContent value={type} className="mt-4">
            <div className="space-y-2">
              {leaderboard.map((player) => (
                <div
                  key={player.username}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="text-lg font-bold w-12 text-center">{getRankIcon(player.rank)}</div>

                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{player.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-medium">{player.username}</div>
                    <div className="text-sm text-muted-foreground">
                      Joined {new Date(player.joinedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right">
                    {type === "rating" && (
                      <Badge variant="secondary" className="text-lg">
                        {player.rating}
                      </Badge>
                    )}
                    {type === "games" && (
                      <Badge variant="secondary" className="text-lg">
                        {player.gamesPlayed}
                      </Badge>
                    )}
                    {type === "puzzles" && (
                      <Badge variant="secondary" className="text-lg">
                        {player.puzzlesSolved}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No players found. Be the first to play!</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
