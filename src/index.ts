import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./api/auth/routes/authRoutes";
import { requisitionRouter } from "./api/routes";

dotenv.config();

const cors = require("cors");
const app = express();

app.use(cors());

app.use(cors({ origin: "http://localhost:3000" }));

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/requisitions", requisitionRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
