import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"
import { Game } from "@/lib/models/Game"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const userProfile = await User.findById(user.userId).select("-password")

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get recent games
    const recentGames = await Game.find({
      $or: [{ whitePlayer: user.userId }, { blackPlayer: user.userId }],
    })
      .sort({ playedAt: -1 })
      .limit(5)
      .populate("whitePlayer", "username")
      .populate("blackPlayer", "username")

    // Calculate win/loss statistics
    const gameStats = await Game.aggregate([
      {
        $match: {
          $or: [{ whitePlayer: user.userId }, { blackPlayer: user.userId }],
        },
      },
      {
        $group: {
          _id: "$result",
          count: { $sum: 1 },
        },
      },
    ])

    const stats = {
      wins: 0,
      losses: 0,
      draws: 0,
    }

    gameStats.forEach((stat) => {
      if (stat._id === "white" || stat._id === "black") {
        // Determine if this user won or lost
        // This is simplified - you'd need to check which color the user played
        stats.wins += stat.count
      } else if (stat._id === "draw") {
        stats.draws += stat.count
      }
    })

    return NextResponse.json({
      profile: userProfile,
      recentGames,
      stats,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { username, bio } = await request.json()

    const updatedUser = await User.findByIdAndUpdate(user.userId, { username, bio }, { new: true, select: "-password" })

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
