import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  createPost,
  deletePost,
  getFeed,
  getPost,
  getUserPosts,
  likeDislike,
  replyToPost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.post("/create", protectRoute, createPost);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);
router.put("/likeUnlike/:postId", protectRoute, likeDislike);
router.put("/reply/:postId", protectRoute, replyToPost);
router.delete("/delete/:postId", protectRoute, deletePost);

export default router;
