import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/helpers.js";

export async function getUser(req, res) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");
    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
}

export async function signpUser(req, res) {
  try {
    const { name, email, password, username } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res
        .status(200)
        .json({ message: "User created successfully", user: newUser });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isCorrectPassword = bcrypt.compareSync(
      password,
      user?.password || ""
    );

    if (!user || !isCorrectPassword)
      return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
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
