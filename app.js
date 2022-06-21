import "dotenv/config";

import express from "express";
import oidc from "express-openid-connect";
const { auth, claimCheck, claimIncludes, claimEquals } = oidc;

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { DatabaseConnect } from "./db/index.js";
import LoggerService from "./logger/LoggerService.js";
import informationRoutes from "./routes/information.js";
import translationRoutes from "./routes/translation.js";

const {
  NODE_ENV,
  NODE_LOCAL_PORT: port,
  ISSUER_BASE_URL: issuerBaseURL,
  CLIENT_ID: clientID,
  BASE_URL: baseURL,
  SECRET: secret,
} = process.env;

const app = express();

app.use(express.json({ limit: "60KB" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  auth({
    authRequired: true,
    auth0Logout: true,
    baseURL,
    clientID,
    issuerBaseURL,
    secret,
  })
);

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
app.use(helmet());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Our API can serve you only 100 times every 15 mins.",
    standardHeaders: false,
    legacyHeaders: false,
  })
);

app.use("/api/information", informationRoutes);
app.use("/api/translation", translationRoutes);

app.get(
  "/profile",
  // claimIncludes("Admin"),
  // claimCheck((req, claims) => {
  //   claims.isAdmin || claims.roles.includes("Admin");
  // }),
  // claimCheck((req, claims) => {
  //   return claims.isAdmin && claims.roles.includes("Admin");
  // }),
  // claimEquals("isAdmin", true),
  // claimEquals("Admin", true),
  (req, res) => {
    return res.status(200).json(req.oidc.user);
  }
);

app.listen(port, () => {
  LoggerService.info(`Server listening on port ${port}`);
  DatabaseConnect();
});

export default app;
