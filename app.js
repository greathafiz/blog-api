// import client from "./db/connect.js"
import "dotenv/config";
import "express-async-errors";
import connectDB from "./db/connect.js";
import { authRouter } from "./routers/authRouter.js";
import { articleRouter } from "./routers/articleRouter.js";
import { commentRouter } from "./routers/commentRouter.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import express from "express";
const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => res.send(`<h2>My Blogging Platform</h2>`));

app.use("/api/v1", authRouter);
app.use("/api/v1", articleRouter);
app.use("/api/v1", commentRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server running on port ${port}`));
  } catch (error) {
    console.error(`connection to the database failed`, error);
  }
};

start();

// client.connect()
