import { Router } from "express";
import authenticate from "../middlewares/authenicate.middleware";
import {
  addWorkspaceMemberSchema,
  createWorkspaceSchema,
  updateWorkspaceByIdSchema,
  updateWorkspaceMemberSchema,
} from "../validators/workspace.validators";
import validate from "../middlewares/validate.middleware";
import {
  addWorkspaceMemberHandler,
  createWorkspaceHandler,
  deleteMemberFromWorkspaceHandler,
  deleteWorkspaceHandler,
  getWorkspaceByIdHandler,
  getWorkspacesHandler,
  updatedWorkspaceMemberHandler,
  updateWorkspaceByIdHandler,
} from "../controllers/workspace.controllers";
import { paramsIdSchema } from "../validators/common.validators";

const workspaceRouter = Router();

workspaceRouter.use(authenticate);

workspaceRouter.post(
  "/",
  validate(createWorkspaceSchema),
  createWorkspaceHandler,
);

workspaceRouter.get("/", getWorkspacesHandler);

workspaceRouter.get(
  "/:id",
  validate(paramsIdSchema, "params"),
  getWorkspaceByIdHandler,
);

workspaceRouter.patch(
  "/:id",
  validate(paramsIdSchema, "params"),
  validate(updateWorkspaceByIdSchema),
  updateWorkspaceByIdHandler,
);

workspaceRouter.delete(
  "/:id",
  validate(paramsIdSchema, "params"),
  deleteWorkspaceHandler,
);

workspaceRouter.patch(
  "/:id/members",
  validate(paramsIdSchema, "params"),
  validate(updateWorkspaceMemberSchema),
  updatedWorkspaceMemberHandler,
);

workspaceRouter.post(
  "/:id/members",
  validate(paramsIdSchema, "params"),
  validate(addWorkspaceMemberSchema),
  addWorkspaceMemberHandler,
);

workspaceRouter.delete("/:id/members", validate(paramsIdSchema, "params"), deleteMemberFromWorkspaceHandler);

export default workspaceRouter;
