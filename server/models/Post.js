import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    username: { type: String },
    title: { type: String, required: true },
    text: { type: String, required: true },
    imgUrl: { type: String, defalt: "" },
    views: { type: Number, defalt: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
