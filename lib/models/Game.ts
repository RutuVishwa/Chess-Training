import mongoose from "mongoose"

const gameSchema = new mongoose.Schema({
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // null for computer games
  },
  result: {
    type: String,
    enum: ["white", "black", "draw"],
    required: true,
  },
  moves: [
    {
      type: String,
      required: true,
    },
  ],
  gameMode: {
    type: String,
    enum: ["computer", "human", "puzzle"],
    required: true,
  },
  timeControl: {
    type: String,
    default: "unlimited",
  },
  finalPosition: {
    type: String, // FEN string
    required: true,
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
})

export const Game = mongoose.models.Game || mongoose.model("Game", gameSchema)
