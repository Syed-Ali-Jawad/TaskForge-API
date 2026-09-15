import { Router } from "express";
import authenticate from "../middlewares/authenicate.middleware";
import {
  addTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateTaskHandler,
} from "../controllers/task.controllers";
import { paramsIdSchema } from "../validators/common.validators";
import validate from "../middlewares/validate.middleware";
import { taskSchema, updateTaskSchema } from "../validators/task.validators";

const taskRouter = Router({
  mergeParams: true,
});

taskRouter.use(authenticate);

taskRouter.get("/", getTasksHandler);

taskRouter.get("/:id", validate(paramsIdSchema), getTaskByIdHandler);

taskRouter.post("/", validate(taskSchema), addTaskHandler);

taskRouter.patch(
  "/:id",
  validate(paramsIdSchema),
  validate(updateTaskSchema),
  updateTaskHandler,
);

taskRouter.delete("/:id", validate(paramsIdSchema), deleteTaskHandler);

export default taskRouter;
