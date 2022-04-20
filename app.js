import dotenv from "dotenv";
dotenv.config();

import express from "express";
import compression from "compression";
import cors from "cors";

import { DatabaseConnect } from "./db/index.js";
import routes from "./routes/language.js";
import LoggerService from "./logger/LoggerService.js";

const { NODE_LOCAL_PORT: port } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(
  cors({
    origin: [
      "https://abcdarab.com",
      "https://arabgatewallet.com",
      "https://arabnetwork.org",
    ],
    optionsSuccessStatus: 200,
  })
);

app.use("/api/language", routes);

app.listen(port, () => {
  LoggerService.info(`Server listening on port ${port}`);
  DatabaseConnect();
});

export default app;
