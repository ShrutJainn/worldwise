import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized user" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
}
