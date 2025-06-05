import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  rating: {
    type: Number,
    default: 1200,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  puzzlesSolved: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  solvedPuzzles: [
    {
      puzzleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Puzzle",
      },
      solvedAt: Date,
      timeSpent: Number,
    },
  ],
  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    boardStyle: {
      type: String,
      enum: ["classic", "modern", "wood"],
      default: "classic",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)
