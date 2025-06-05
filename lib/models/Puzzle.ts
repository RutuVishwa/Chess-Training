import mongoose from "mongoose"

const puzzleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fen: {
    type: String, // Starting position
    required: true,
  },
  solution: [
    {
      type: String, // Array of moves in algebraic notation
      required: true,
    },
  ],
  theme: {
    type: String,
    enum: ["tactics", "endgame", "opening", "middlegame", "checkmate", "pin", "fork", "skewer"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    required: true,
  },
  rating: {
    type: Number,
    default: 1200,
  },
  solveCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Puzzle = mongoose.models.Puzzle || mongoose.model("Puzzle", puzzleSchema)
