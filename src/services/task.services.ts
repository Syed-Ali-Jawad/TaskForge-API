import { TaskPriority, TaskStatus } from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import prisma from "../lib/prisma";
import { TaskBody } from "../types/task.types";

const taskFetch = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  assignee: {
    name: true,
  },
  reporter: {
    name: true,
  },
};

const getTasks = async (projectId: string) => {
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
    select: taskFetch,
  });

  return tasks;
};

const getTaskById = async (projectId: string, id: string) => {
  const task = await prisma.task.findUnique({
    where: {
      projectId,
      id,
    },
    select: {
      ...taskFetch,
      comments: {
        id: true,
        comment: true,
        author: { name: true },
        createdAt: true,
      },
    },
  });

  return task;
};

const addTask = async (projectId: string, body: TaskBody) => {
  const addedTask = await prisma.task.create({
    data: {
      ...body,
      priority: body.priority as TaskPriority,
      projectId,
      status: TaskStatus.TODO,
    },
    select: taskFetch,
  });

  return addedTask;
};

const updateTaskById = async (
  projectId: string,
  taskId: string,
  body: Partial<TaskBody>,
) => {
  const updatedTask = await prisma.task.update({
    where: { projectId, id: taskId },
    data: { ...body } as Prisma.TaskUncheckedUpdateInput,
  });

  return updateTaskById;
};

const deleteTask = async (projectId: string, id: string) => {
  const deletedTask = await prisma.task.delete({
    where: {
      projectId,
      id,
    },
    select: {
      name: true,
      project: {
        name: true,
      },
    },
  });

  return deletedTask;
};

export { getTasks, getTaskById, addTask, updateTaskById, deleteTask };
