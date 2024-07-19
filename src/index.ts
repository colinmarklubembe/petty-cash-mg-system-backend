import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./api/models/config/data-source";
import authRouter from "./api/auth/routes/authRoutes";

const cors = require("cors");
const app = express();

app.use(cors());

app.use(cors({ origin: "http://localhost:3000" }));

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
