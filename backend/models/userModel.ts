import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
  avatar: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  posts: { type: Number, default: 0 },
});

export const userModel =
  mongoose.models.users || mongoose.model("users", userSchema);
