import { z } from "zod";
import { ProjectStatus } from "../generated/prisma/enums";
import { paginationSchema } from "./common.validators";
import { SortOrder } from "../generated/prisma/internal/prismaNamespace";

const paramWorkspaceIdSchema = z.object({
  workspaceId: z.uuid("Invalid UUID"),
});

const projectFieldsSchema = z.object({
  name: z.string().min(2).max(15),
  shortKey: z
    .string()
    .min(2)
    .max(5)
    .regex(/^[A-Za-z]+$/, "Short key must contain only letters")
    .transform((value) => value.toUpperCase()),
  description: z.string().optional(),
});

const getProjectsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  shortKey: z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : value),
    z
      .array(
        z
          .string()
          .regex(/^[A-Za-z]+$/, "Short key must contain only letters")
          .transform((value) => value.toUpperCase()),
      )
      .optional(),
  ),
  status: z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : value),
    z
      .array(
        z.enum(ProjectStatus, {
          error: "Input is not a valid Project Status",
        }),
      )
      .optional(),
  ),
  sortOrder: z
    .enum(SortOrder, { error: "Invalid sort order used." })
    .default(SortOrder.asc),
});

const updateProjectSchema = projectFieldsSchema.partial().extend({
  status: z
    .enum(ProjectStatus, {
      error: "Invalid Project Status",
    })
    .optional(),
});

export {
  paramWorkspaceIdSchema,
  projectFieldsSchema,
  updateProjectSchema,
  getProjectsQuerySchema,
};
