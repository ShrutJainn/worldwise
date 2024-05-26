import express from "express";
import {
  followUnUser,
  getUser,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnUser);
router.put("/update/:id", protectRoute, updateUser);
export default router;
