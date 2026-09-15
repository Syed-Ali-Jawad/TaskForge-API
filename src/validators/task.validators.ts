import { z } from "zod";
import { TaskPriority, TaskStatus } from "../generated/prisma/enums";

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

export { paramsProjectIdSchema, taskSchema, updateTaskSchema };
