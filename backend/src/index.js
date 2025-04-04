import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json()); // extract json data from the request body
app.use(cookieParser()); // parse cookies from the request

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

connectDB();

app.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
