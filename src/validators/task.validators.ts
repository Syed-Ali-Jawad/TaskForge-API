import { z } from "zod";
import { TaskPriority, TaskStatus } from "../generated/prisma/enums";
import { paginationSchema, sortQuerySchema } from "./common.validators";
import { SortOrder } from "../generated/prisma/internal/prismaNamespace";
import { TaskSortBy } from "../types/task.types";

const paramsProjectIdSchema = z.object({
  projectId: z.uuid("Invalid UUID"),
});

const taskSchema = z.object({
  id: z.uuid("Invalid ID"),
  title: z
    .string()
    .min(5, { error: "Task title cant be lesser then 2 characters" })
    .max(20, { error: "Task title cant be lengtheir than 20 characters" }),
  description: z.string().min(5).max(120).optional(),
  priority: z.enum(TaskPriority, { error: "Invalid priority" }),
  dueDate: z.string().refine((date) => new Date(date) >= new Date(), {
    message: "Due date cannot be in the past",
  }),
  assigneeId: z.uuid("Invalid UUID").optional(),
  reporterId: z.uuid("Invalid UUID"),
});

const updateTaskSchema = taskSchema.partial().extend({
  status: z.enum(TaskStatus, { error: "Unknown status used" }).optional(),
});

const taskQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  assigneeId: z
    .preprocess(
      (value: string) => value.split(","),
      z.array(z.uuid("Invalid UUID")),
    )
    .optional(),
  reporterId: z
    .preprocess(
      (value: string) => value.split(","),
      z.array(z.uuid("Invalid UUID")),
    )
    .optional(),
  status: z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : value),
    z
      .array(
        z.enum(TaskStatus, {
          error: "Input is not a valid Task Status",
        }),
      )
      .optional(),
  ),

  priority: z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : value),
    z
      .array(
        z.enum(TaskPriority, {
          error: "Input is not a valid Task Status",
        }),
      )
      .optional(),
  ),
  sortBy: z
    .enum(TaskSortBy, { error: "Sort applied on invalid field" })
    .optional(),
  sortOrder: z.enum(SortOrder, { error: "Invalid sort order used." }),
});

export { paramsProjectIdSchema, taskSchema, updateTaskSchema, taskQuerySchema };
