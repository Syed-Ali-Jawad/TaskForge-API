import { z } from "zod";

const paramsTaskId = z.object({
  taskId: z.uuid("Invalid UUID"),
});

const commentSchema = z.object({
  comment: z.string(),
  taskId: z.uuid("Invalid UUID"),
  authorId: z.uuid("Invalid UUID"),
});

const updateCommentSchema = commentSchema.partial();

export { paramsTaskId, commentSchema, updateCommentSchema };
