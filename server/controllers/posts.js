import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//Create Post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: fileName,
        author: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      });
      return res.json(newPostWithImage);
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imgUrl: "",
      author: req.userId,
    });
    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithoutImage },
    });
    return res.json(newPostWithoutImage);
  } catch (error) {
    res.json({
      message: "Something went wrong.",
    });
  }
};

//Get all posts
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");
    const popularPosts = await Post.find().limit(5).sort("-views");
    if (!posts) {
      res.json({ message: "No posts" });
    }
    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

//Get post by id
export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.json(post);
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

//Get my posts
export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );
    res.json(list);
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

//Remove post
export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.json({ message: "Such a post doesn't exist" });

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });

    res.json({ message: "The post was deleted" });
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

//Update post
export const updatePost = async (req, res) => {
  try {
    const { title, text, id } = req.body;
    const post = await Post.findById(id);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
      post.imgUrl = fileName || "";
    }

    post.title = title;
    post.text = text;

    await post.save();

    res.json(post);
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

// Get Post Comments
export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comments = await Comment.find({ postId: post._id });

    const authorIds = [...new Set(comments.map((comment) => comment.author))];

    const authors = await User.find({ _id: { $in: authorIds } });

    const authorsMap = authors.reduce((acc, author) => {
      acc[author._id] = author;
      return acc;
    }, {});

    res.json({ comments, authors: authorsMap });
  } catch (error) {
    res.status(500).json({ message: "Failed to get comments" });
  }
};
