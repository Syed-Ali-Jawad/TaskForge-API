import { TaskPriority, TaskStatus } from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import prisma from "../lib/prisma";
import { TaskBody } from "../types/task.types";
import AppError from "../error/app-error";

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
  await checkIfProjectArchived(
    projectId,
    "Archived project can't receive new tasks.",
  );
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
  await checkIfProjectArchived(
    projectId,
    "Archived project can not recieve task updates.",
  );
  const updatedTask = await prisma.task.update({
    where: { projectId, id: taskId },
    data: { ...body } as Prisma.TaskUncheckedUpdateInput,
  });

  return updateTaskById;
};

const deleteTask = async (projectId: string, id: string) => {
  await checkIfProjectArchived(
    projectId,
    "Task of an archived project can not be deleted.",
  );
  
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

const checkIfProjectArchived = async (projectId: string, error: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      isArchived: true,
    },
  });

  if (project?.isArchived) {
    throw new AppError(409, error);
  }
};
