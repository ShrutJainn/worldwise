import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  createPlace,
  deletePlace,
  getPlaces,
} from "../controllers/placeController.js";

const router = express.Router();

router.get("/getPlaces", protectRoute, getPlaces);
router.post("/create", protectRoute, createPlace);
router.delete("/delete/:placeId", protectRoute, deletePlace);
export default router;
