import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "rating"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let sortField = "rating"
    if (type === "puzzles") sortField = "puzzlesSolved"
    if (type === "games") sortField = "gamesPlayed"

    const users = await User.find({})
      .select("username rating gamesPlayed puzzlesSolved createdAt")
      .sort({ [sortField]: -1 })
      .limit(limit)

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      rating: user.rating,
      gamesPlayed: user.gamesPlayed,
      puzzlesSolved: user.puzzlesSolved,
      joinedAt: user.createdAt,
    }))

    return NextResponse.json({ leaderboard, type })
  } catch (error) {
    console.error("Get leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
