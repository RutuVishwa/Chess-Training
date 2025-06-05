import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Game } from "@/lib/models/Game"
import { User } from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { opponent, result, moves, gameMode, timeControl, finalPosition } = await request.json()

    // Create game record
    const game = await Game.create({
      whitePlayer: user.userId,
      blackPlayer: opponent || null,
      result,
      moves,
      gameMode,
      timeControl,
      finalPosition,
      playedAt: new Date(),
    })

    // Update user statistics
    await User.findByIdAndUpdate(user.userId, {
      $inc: { gamesPlayed: 1 },
    })

    // Update rating based on result (simplified rating system)
    if (result !== "draw") {
      const ratingChange = result === "white" ? 20 : -20
      await User.findByIdAndUpdate(user.userId, {
        $inc: { rating: ratingChange },
      })
    }

    return NextResponse.json({
      message: "Game saved successfully",
      gameId: game._id,
    })
  } catch (error) {
    console.error("Save game error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const games = await Game.find({
      $or: [{ whitePlayer: user.userId }, { blackPlayer: user.userId }],
    })
      .sort({ playedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("whitePlayer", "username rating")
      .populate("blackPlayer", "username rating")

    const total = await Game.countDocuments({
      $or: [{ whitePlayer: user.userId }, { blackPlayer: user.userId }],
    })

    return NextResponse.json({
      games,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get games error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
