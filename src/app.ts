import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(errorMiddleware);

  return app;
};

export default createApp;
