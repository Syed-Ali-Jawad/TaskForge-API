import { z } from "zod";
import { ProjectStatus } from "../generated/prisma/enums";

const paramWorkspaceIdSchema = z.object({
  workspaceId: z.uuid("Invalid UUID"),
});

const projectFieldsSchema = z.object({
  name: z.string().min(1).max(15),
  shortKey: z
    .string()
    .min(2)
    .max(5)
    .regex(/^[A-Za-z0-9]+$/, "Short key must contain only letters and numbers")
    .transform((value) => value.toUpperCase()),
  description: z.string().optional(),
});

const updateProjectSchema = projectFieldsSchema.partial().extend({
  status: z
    .enum(ProjectStatus, {
      error: "Invalid Project Status",
    })
    .optional(),
});

export { paramWorkspaceIdSchema, projectFieldsSchema, updateProjectSchema };
