import { Router } from "express";
import {
  getProjectsQuerySchema,
  projectFieldsSchema,
  updateProjectSchema,
} from "../validators/project.validators";
import validate from "../middlewares/validate.middleware";
import {
  addProjectHandler,
  deleteProjectHandler,
  getProjectByIdHandler,
  getProjectsHandler,
  updateProjectByIdHandler,
} from "../controllers/project.controllers";
import { paramsIdSchema } from "../validators/common.validators";
import authenticate from "../middlewares/authenicate.middleware";

const projectRouter = Router({ mergeParams: true });

projectRouter.use(authenticate);

projectRouter.post("/", validate(projectFieldsSchema), addProjectHandler);

projectRouter.get(
  "/",
  validate(getProjectsQuerySchema, "query"),
  getProjectsHandler,
);

projectRouter.get("/:id", validate(paramsIdSchema), getProjectByIdHandler);

projectRouter.patch(
  "/:id",
  validate(paramsIdSchema),
  validate(updateProjectSchema),
  updateProjectByIdHandler,
);

projectRouter.delete("/:id", validate(paramsIdSchema), deleteProjectHandler);

export default projectRouter;
