import mongoose from "mongoose";

export async function connectDB() {
  await mongoose
    .connect(
      "mongodb+srv://shrutjain488:IooPk9tg1cC6aWob@cluster0.2n1hzqp.mongodb.net/worldwise?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err) => console.log(err));
}
