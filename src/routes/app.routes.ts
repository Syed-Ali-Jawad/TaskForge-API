import { Router } from "express";
import authRouter from "./auth.routes";
import workspaceRouter from "./workspace.routes";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/workspace", workspaceRouter);

export default appRouter;
