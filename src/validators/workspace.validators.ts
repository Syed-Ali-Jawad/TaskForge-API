import { z } from "zod";
import { Role } from "../generated/prisma/enums";
import { paramsIdSchema } from "./common.validators";

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
  memberId: z.uuid("Inavlid UUID"),
});

const joinWorkspaceSchema = z.object({
  role: z.enum(Role, {
    error: "Invalid workspace role",
  }),
});

const deleteMemberSchema = paramsIdSchema.extend({
  memberId: z.uuid("Invalid Member Id"),
});

export {
  createWorkspaceSchema,
  updateWorkspaceByIdSchema,
  updateWorkspaceMemberSchema,
  addWorkspaceMemberSchema,
  joinWorkspaceSchema,
  deleteMemberSchema,
};
