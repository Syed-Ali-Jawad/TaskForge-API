import express from "express";
import cors from "cors";

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true }));

  return app;
};

export default createApp;
