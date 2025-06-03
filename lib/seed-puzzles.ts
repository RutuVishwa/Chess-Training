import { connectDB } from "./db"
import { Puzzle } from "./models/Puzzle"

const samplePuzzles = [
  {
    title: "Back Rank Mate",
    description: "Find the winning move that delivers checkmate",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: ["Re8#"],
    theme: "checkmate",
    difficulty: "beginner",
    rating: 1000,
  },
  {
    title: "Knight Fork",
    description: "Use your knight to attack two pieces at once",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Ng5", "d6", "Nxf7"],
    theme: "fork",
    difficulty: "intermediate",
    rating: 1300,
  },
  {
    title: "Pin the Queen",
    description: "Pin the opponent's queen to their king",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Bg5"],
    theme: "pin",
    difficulty: "beginner",
    rating: 1100,
  },
  {
    title: "Skewer Attack",
    description: "Force the king to move and win material",
    fen: "4k3/8/8/8/8/8/4R3/4K3 w - - 0 1",
    solution: ["Re8+", "Kf7", "Re7+"],
    theme: "skewer",
    difficulty: "intermediate",
    rating: 1250,
  },
  {
    title: "Smothered Mate",
    description: "Deliver checkmate with a knight",
    fen: "6rk/6pp/8/8/8/8/5N2/6K1 w - - 0 1",
    solution: ["Nf7#"],
    theme: "checkmate",
    difficulty: "advanced",
    rating: 1600,
  },
]

export async function seedPuzzles() {
  try {
    await connectDB()

    // Clear existing puzzles
    await Puzzle.deleteMany({})

    // Insert sample puzzles
    await Puzzle.insertMany(samplePuzzles)

    console.log("Puzzles seeded successfully!")
  } catch (error) {
    console.error("Error seeding puzzles:", error)
  }
}
