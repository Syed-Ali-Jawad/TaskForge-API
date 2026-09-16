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
  getWorkspaceMembersHandler,
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

workspaceRouter.get("/:id", validate(paramsIdSchema), getWorkspaceByIdHandler);

workspaceRouter.patch(
  "/:id",
  validate(paramsIdSchema),
  validate(updateWorkspaceByIdSchema),
  updateWorkspaceByIdHandler,
);

workspaceRouter.delete(
  "/:id",
  validate(paramsIdSchema),
  deleteWorkspaceHandler,
);

workspaceRouter.get("/:id/members", validate(paramsIdSchema), getWorkspaceMembersHandler)

workspaceRouter.patch(
  "/:id/members",
  validate(paramsIdSchema),
  validate(updateWorkspaceMemberSchema),
  updatedWorkspaceMemberHandler,
);

workspaceRouter.post(
  "/:id/members",
  validate(paramsIdSchema),
  validate(addWorkspaceMemberSchema),
  addWorkspaceMemberHandler,
);

workspaceRouter.delete(
  "/:id/members",
  validate(paramsIdSchema),
  deleteMemberFromWorkspaceHandler,
);

export default workspaceRouter;
