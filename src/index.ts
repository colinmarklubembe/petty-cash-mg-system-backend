import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./api/auth/routes/authRoutes";
import {
  fundRouter,
  reportRouter,
  companyRouter,
  dashboardRouter,
  requisitionRouter,
  transactionRouter,
} from "./api/routes";

dotenv.config();

const cors = require("cors");
const app = express();

// Configure CORS to allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://cashfusion-v1-ju3lxvs5d-colinmarklubembes-projects.vercel.app",
  "https://cashfusion-v1.vercel.app",
];

app.use(
  cors({
    origin: (origin: any, callback: any) => {
      console.log(`CORS request from: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRouter);
app.use("/api/reports", reportRouter);
app.use("/api/companies", companyRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/requisitions", requisitionRouter);
app.use("/api/transactions", transactionRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
