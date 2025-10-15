import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import errorHandler from "./utility/errorHandling.js";
import route from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 4000;

connectDb();
const app = express();

app.use(express.json());
app.use("/api/user/v1", route);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
