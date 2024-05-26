import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export async function getUser(req, res) {
  //we'll fetch user using either username or userid
  //query will either be username or userid

  const { query } = req.params;
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      //query is user id
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      //query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function signupUser(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      const token = generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        token,
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isCorrectPassword = await bcrypt.compareSync(
      password,
      user?.password || ""
    );

    if (!user || !isCorrectPassword)
      return res.status(400).json({ error: "Invalid username or password" });

    const token = generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function logoutUser(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out succesfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function followUnUser(req, res) {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToFollow || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //unfollow
      //modify current user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      //modify user to follow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow

      //modify current user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      //modify user to follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  const { name, username, email, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    //Find all the posts that this user has replied and update username and userProfilPic there
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.userProfilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    //password should not be sent to the client
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
