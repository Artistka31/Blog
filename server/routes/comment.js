import { Router } from "express";
import { checkAuth } from "../utiles/checkAuth.js";
import {
  createComment,
  getCommentById,
  updateComment,
} from "../controllers/comments.js";

const router = new Router();

// Create Comment
// http://localhost:3002/api/comments/:id
router.post("/:id", checkAuth, createComment);

// Get Comment By Id
// http://localhost:3002/api/comments/:id
router.get("/comments/:id", checkAuth, getCommentById);

// Update Comment
// http://localhost:3002/api/comments/:id
/* router.put("/:id", checkAuth, updateComment); */
router.put("/:id", checkAuth, (req, res) => {
  const commentId = req.params.id;
  updateComment(req, res, commentId);
});

export default router;
