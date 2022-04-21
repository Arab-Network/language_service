import dotenv from "dotenv";
dotenv.config();

import express from "express";
import compression from "compression";
import cors from "cors";

import { DatabaseConnect } from "./db/index.js";
import LoggerService from "./logger/LoggerService.js";
import informationRoutes from "./routes/information.js";
import translationRoutes from "./routes/translation.js";

const { NODE_LOCAL_PORT: port, NODE_ENV } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(
  cors({
    origin: [
      NODE_ENV === "development" && "http://localhost:3000",
      "https://abcdarab.com",
      "https://arabgatewallet.com",
      "https://arabnetwork.org",
    ],
    optionsSuccessStatus: 200,
  })
);

app.use("/api/information", informationRoutes);
app.use("/api/translation", translationRoutes);

app.listen(port, () => {
  LoggerService.info(`Server listening on port ${port}`);
  DatabaseConnect();
});

export default app;
