import mongoose from "mongoose";

async function connectDB() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Successfully connected to database"))
    .catch((err) => console.log(err.message));
}

export default connectDB;
