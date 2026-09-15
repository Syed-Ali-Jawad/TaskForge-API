import type { Request, Response } from "express";
import {
  addTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTaskById,
} from "../services/task.services";

const getTasksHandler = async (req: Request, res: Response) => {
  const { projectId } = getParams(req.params);

  const tasks = await getTasks(projectId);

  return res.status(200).json({ tasks });
};

const getTaskByIdHandler = async (req: Request, res: Response) => {
  const { projectId, taskId } = getParams(req.params);

  const task = await getTaskById(projectId, taskId);

  return res.status(200).json(task);
};

const addTaskHandler = async (req: Request, res: Response) => {
  const { projectId } = getParams(req.params);

  const addedTask = await addTask(projectId, req.body);

  return res.status(201).json({
    message: "Task created",
    task: addedTask,
  });
};

const updateTaskHandler = async (req: Request, res: Response) => {
  const { projectId, taskId } = getParams(req.params);

  const updatedTask = await updateTaskById(projectId, taskId, req.body);

  return res.status(200).json(updatedTask);
};

const deleteTaskHandler = async (req: Request, res: Response) => {
  const { projectId, taskId } = getParams(req.params);

  const deletedTask = await deleteTask(projectId, taskId);

  return res
    .status(200)
    .json({
      message: `Task ${deletedTask.name} from project ${deletedTask.project.name} has been deleted.`,
    });
};

export {
  getTasksHandler,
  getTaskByIdHandler,
  addTaskHandler,
  updateTaskHandler,
  deleteTaskHandler
};

const getParams = (params: any) => ({
  projectId: params.projectId?.[0] || "",
  taskId: params.id?.[0] || "",
});
