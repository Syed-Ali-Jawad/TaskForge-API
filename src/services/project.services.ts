import AppError from "../error/app-error";
import { ProjectStatus, Role } from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import { checkAuthorization } from "../lib/utils";
import { ProjectBody, ProjectQueries } from "../types/project.types";

const addProject = async (
  userId: string,
  workspaceId: string,
  body: ProjectBody,
) => {
  await checkAuthorization(userId, workspaceId);
  const addedProject = await prisma.project.create({
    data: {
      name: body.name,
      shortKey: body.shortKey,
      description: body.description || null,
      status: ProjectStatus.ACTIVE,
      workspaceId,
    },
    select: {
      name: true,
      shortKey: true,
      workspace: {
        name: true,
      },
    },
  });

  return addedProject;
};

const getProjects = async (
  userId: string,
  workspaceId: string,
  queries: ProjectQueries,
) => {
  const userRole = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    select: { role: true },
  });

  const {
    page,
    pageSize,
    search,
    shortKey: shortKeyArray = [],
    status: statusArray = [],
    sortOrder,
  } = queries;

  const projects = await prisma.project.findMany({
    where: {
      workspaceId,
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(shortKeyArray.length > 0 && { shortKey: { in: shortKeyArray } }),
      ...(statusArray?.length > 0 && { status: { in: statusArray } }),
    },
    orderBy: {
      name: sortOrder,
    },
    select: {
      id: true,
      name: true,
      shortKey: true,
      description: true,
      status: true,
      tasks: userRole.role !== Role.MEMBER,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return projects;
};

const getProjectById = async (workspaceId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      shortKey: true,
      descitpion: true,
      status: true,
      tasks: true,
    },
  });

  return project;
};

const updateProjectById = async (
  userId: string,
  projectId: string,
  workspaceId: string,
  body: Partial<ProjectBody>,
) => {
  await checkAuthorization(userId, workspaceId);

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      workspaceId,
    },
    select: {
      isArchived: true,
    },
  });

  if (project.isArchived) {
    throw new AppError(409, "Archived project can not be edited");
  }

  const updatedProject = await prisma.project.update({
    data: {
      ...body,
    },
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  });

  return updatedProject;
};

const deleteProject = async (
  userId: string,
  workspaceId: string,
  id: string,
) => {
  await checkAuthorization(userId, workspaceId);

  const deletedProject = await prisma.project.delete({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });

  return deletedProject;
};

export {
  addProject,
  getProjects,
  getProjectById,
  updateProjectById,
  deleteProject,
};
