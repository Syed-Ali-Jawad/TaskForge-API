import {
  ProjectStatus,
  Role,
  TaskPriority,
  TaskStatus,
} from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import prisma from "../lib/prisma";
import { TaskBody, TaskQueryParams, TaskSortBy } from "../types/task.types";
import AppError from "../error/app-error";
import { SortOrder } from "../generated/prisma/internal/prismaNamespace";

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
    select: {
      id: true,
      name: true,
    },
  },
  reporter: {
    select: {
      id: true,
      name: true,
    },
  },
};

const getTasks = async (projectId: string, queries: TaskQueryParams) => {
  const {
    page,
    pageSize,
    search,
    assigneeId: assignedIdsArray = [],
    reporterId: reporterIdsArray = [],
    status: statusArray = [],
    priority: priorityArray = [],
    sortBy = TaskSortBy.CREATED_AT,
    sortOrder = SortOrder.desc,
  } = queries;

  console.log({
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    sortBy,
    sortOrder,
  });
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      ...(search && { title: { contains: search, mode: "insensitive" } }),
      ...(assignedIdsArray.length > 0 && {
        assigneeId: { in: assignedIdsArray },
      }),
      ...(reporterIdsArray.length > 0 && {
        reporterId: { in: reporterIdsArray },
      }),
      ...(statusArray.length > 0 && {
        status: { in: statusArray as TaskStatus[] },
      }),
      ...(priorityArray.length > 0 && {
        priority: { in: priorityArray as TaskPriority[] },
      }),
    },
    orderBy: [
      {
        [sortBy]: sortOrder,
      },
      {
        id: "asc",
      },
    ],
    select: taskFetch,
    skip: (page - 1) * pageSize,
    take: pageSize,
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
        select: {
          id: true,
          comment: true,
          author: { select: { name: true } },
          createdAt: true,
        },
      },
    },
  });

  return task;
};

const addTask = async (projectId: string, userId: string, body: TaskBody) => {
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
      reporterId: userId,
    },
    select: taskFetch,
  });

  return addedTask;
};

const updateTaskById = async (
  userId: string,
  projectId: string,
  taskId: string,
  body: Partial<TaskBody> & { status?: TaskStatus },
) => {
  await checkIfProjectArchived(
    projectId,
    "Archived project can not recieve task updates.",
  );
  const role = await getUserRole(userId, projectId);

  const updatedTask = await prisma.task.updateManyAndReturn({
    where: {
      projectId,
      id: taskId,
      ...(role === Role.MEMBER
        ? {
            OR: [{ assigneeId: userId }, { reporterId: userId }],
          }
        : {}),
    },
    data: {
      ...body,
      ...(body.status === TaskStatus.DONE
        ? { completionDate: new Date() }
        : body.status
          ? { completionDate: null }
          : {}),
    } as Prisma.TaskUncheckedUpdateInput,
  });

  if (updatedTask.length === 0) {
    throw new AppError(404, "Task not found or not authorized");
  }

  return updatedTask;
};

const deleteTask = async (userId: string, projectId: string, id: string) => {
  await checkIfProjectArchived(
    projectId,
    "Task of an archived project can not be deleted.",
  );

  const role = await getUserRole(userId, projectId);
  const task = await prisma.task.findFirst({
    where: {
      projectId,
      id,
      ...(role === Role.MEMBER
        ? {
            OR: [{ assigneeId: userId }, { reporterId: userId }],
          }
        : {}),
    },
  });

  if (!task) {
    throw new AppError(404, "Task not found or not authorized");
  }

  const deletedTask = await prisma.task.delete({
    where: {
      id: task.id,
    },
    select: {
      title: true,
      project: { select: { name: true } },
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
      status: true,
    },
  });

  if (project?.status === ProjectStatus.ARCHIVED) {
    throw new AppError(409, error);
  }
};

const getUserRole = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  });

  const userRole = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: project?.workspaceId!,
      },
    },
    select: { role: true },
  });
  return userRole?.role;
};
