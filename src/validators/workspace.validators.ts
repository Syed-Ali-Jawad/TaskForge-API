import { z } from "zod";
import { Role } from "../generated/prisma/enums";

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(15, "Workspace name must be at most 15 characters"),
});

const updateWorkspaceByIdSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(15, "Workspace name must be at most 15 characters"),
});

const updateWorkspaceMemberSchema = z.object({
  role: z.enum(Role, {
    error: "Invalid workspace role",
  }),
});

const addWorkspaceMemberSchema = z.object({
  role: z.enum(Role, {
    error: "Invalid workspace role",
  }),
});

export {
  createWorkspaceSchema,
  updateWorkspaceByIdSchema,
  updateWorkspaceMemberSchema,
  addWorkspaceMemberSchema,
};