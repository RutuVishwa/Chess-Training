import { NextResponse } from "next/server"
import { seedPuzzles } from "@/lib/seed-puzzles"

export async function POST() {
  try {
    await seedPuzzles()
    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
