import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  signpUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:username", getUser);
router.post("/signup", signpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
export default router;
