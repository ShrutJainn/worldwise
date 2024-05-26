import mongoose from "mongoose";
import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import { v2 as cloudinary } from "cloudinary";

export async function getFeed(req, res) {
  //we'll fetch user using either username or userid
  //query will either be username or userid
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;
    const newFollowing = following.map((id) => new mongoose.Types.ObjectId(id));

    const feedPosts = await Post.find({
      postedBy: { $in: newFollowing },
    }).sort({ createdAt: -1 });

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
}

export async function getUserPosts(req, res) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Unauthorized user" });

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    if (!posts) return res.status(400).json({ error: "No posts found" });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
}

export async function createPost(req, res) {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;
    if (!postedBy || !text)
      return res
        .status(400)
        .json({ error: "Posted By and Text fields are required" });

    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user._id.toString() != req.user._id.toString())
      return res.status(400).json({ error: "Unauthorized to create post" });

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
}

export async function getPost(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(400).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
}

export async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(400).json({ error: "Post not found" });

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
}

export async function likeDislike(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      //unlike
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //like
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
}

export async function replyToPost(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id.toString();
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text field is required" });
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const user = await User.findById(userId);
    const { profilePic, username } = user;

    const reply = { userId, text, profilePic, username };

    post.replies.push(reply);
    post.save();
    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
}
