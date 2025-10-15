import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import route from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

connectDb();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/user/v1", route);
app.use("/api/admin/v1", adminRoute);

app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
