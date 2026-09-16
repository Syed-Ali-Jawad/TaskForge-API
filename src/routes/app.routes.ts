import { Router } from "express";
import authRouter from "./auth.routes";
import workspaceRouter from "./workspace.routes";
import projectRouter from "./project.routes";
import { paramWorkspaceIdSchema } from "../validators/project.validators";
import validate from "../middlewares/validate.middleware";
import taskRouter from "./task.routes";
import { paramsProjectIdSchema } from "../validators/task.validators";
import { paramsTaskId } from "../validators/comment.validators";
import commentRouter from "./comment.routes";
import userRouter from "./user.routes";

const appRouter = Router();

appRouter.use("/auth", authRouter);

appRouter.use("/user", userRouter);
appRouter.use("/workspaces", workspaceRouter);
appRouter.use(
  "/workspaces/:workspaceId/projects",
  validate(paramWorkspaceIdSchema),
  projectRouter,
);

appRouter.use(
  "/projects/:projectId/tasks",
  validate(paramWorkspaceIdSchema),
  validate(paramsProjectIdSchema),
  taskRouter,
);

appRouter.use("/tasks/:taskId/comments", validate(paramsTaskId), commentRouter);

export default appRouter;
