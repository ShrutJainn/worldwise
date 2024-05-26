import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
