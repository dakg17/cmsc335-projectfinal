import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
  userName: String,
  age: Number,
  artist: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Search", searchSchema);