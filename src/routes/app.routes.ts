import { Router } from "express";
import authRouter from "./auth.routes";
import workspaceRouter from "./workspace.routes";
import projectRouter from "./project.routes";
import { paramWorkspaceIdSchema } from "../validators/project.validators";
import validate from "../middlewares/validate.middleware";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/workspaces", workspaceRouter);
appRouter.use(
  "/workspaces/:workspaceId/projects",
  validate(paramWorkspaceIdSchema),
  projectRouter,
);

export default appRouter;
