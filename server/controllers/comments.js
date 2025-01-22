import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Create Comment
export const createComment = async (req, res) => {
  try {
    const { comment, postId, author } = req.body;

    if (!comment || !postId || !author) {
      return res
        .status(400)
        .json({ message: "Comment, postId, and author cannot be empty" });
    }

    const newComment = new Comment({
      comment,
      postId,
      author,
    });
    await newComment.save();
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res.json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("postId", "title text username createdAt imgUrl")
      .populate("author", "username");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log("Fetched comment data:", comment);
    res.json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (existingComment.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this comment" });
    }

    existingComment.comment = comment;
    await existingComment.save();

    res.json(existingComment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment" });
  }
};
