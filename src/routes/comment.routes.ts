import { Router } from "express";
import authenticate from "../middlewares/authenicate.middleware";
import { paramsProjectIdSchema } from "../validators/task.validators";
import validate from "../middlewares/validate.middleware";
import { commentSchema, updateCommentSchema } from "../validators/comment.validators";
import { addCommentHandler, deleteCommentHandler, updateCommentHandler } from "../controllers/comment.controllers";
import { paramsIdSchema } from "../validators/common.validators";

const commentRouter = Router({ mergeParams: true });

commentRouter.use(authenticate);

commentRouter.patch(
  "/:id",
  validate(paramsProjectIdSchema),
  validate(updateCommentSchema),
  updateCommentHandler,
);

commentRouter.post("/", validate(commentSchema), addCommentHandler)

commentRouter.delete("/:id", validate(paramsIdSchema), deleteCommentHandler)

export default commentRouter;
