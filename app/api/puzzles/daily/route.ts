import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Puzzle } from "@/lib/models/Puzzle"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get today's date as seed for consistent daily puzzle
    const today = new Date().toISOString().split("T")[0]
    const seed = today.split("-").join("")

    // Use date as seed to get same puzzle for the day
    const puzzleCount = await Puzzle.countDocuments()
    const skipAmount = Number.parseInt(seed) % puzzleCount

    const dailyPuzzle = await Puzzle.findOne().skip(skipAmount).limit(1)

    if (!dailyPuzzle) {
      return NextResponse.json({ error: "No puzzle found" }, { status: 404 })
    }

    return NextResponse.json({
      puzzle: dailyPuzzle,
      date: today,
    })
  } catch (error) {
    console.error("Get daily puzzle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
