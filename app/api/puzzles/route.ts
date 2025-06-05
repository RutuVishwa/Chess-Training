import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Puzzle } from "@/lib/models/Puzzle"
import { User } from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty")
    const theme = searchParams.get("theme")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query: any = {}
    if (difficulty) query.difficulty = difficulty
    if (theme) query.theme = theme

    const puzzles = await Puzzle.find(query).limit(limit).sort({ rating: 1 })

    return NextResponse.json({ puzzles })
  } catch (error) {
    console.error("Get puzzles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { puzzleId, solved, timeSpent } = await request.json()

    // Find the puzzle
    const puzzle = await Puzzle.findById(puzzleId)
    if (!puzzle) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 })
    }

    // Update user statistics if solved
    if (solved) {
      await User.findByIdAndUpdate(user.userId, {
        $inc: { puzzlesSolved: 1 },
      })

      // Add to user's solved puzzles
      await User.findByIdAndUpdate(user.userId, {
        $addToSet: {
          solvedPuzzles: {
            puzzleId,
            solvedAt: new Date(),
            timeSpent,
          },
        },
      })
    }

    return NextResponse.json({
      message: solved ? "Puzzle solved!" : "Puzzle attempt recorded",
      solved,
    })
  } catch (error) {
    console.error("Submit puzzle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
