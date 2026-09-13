import { ProjectStatus } from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import { ProjectBody } from "../types/project.types";

const addProject = async (workspaceId: string, body: ProjectBody) => {
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

const getProjects = async (workspaceId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      shortKey: true,
      description: true,
      status: true,
    },
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
  projectId: string,
  workspaceId: string,
  body: Partial<ProjectBody>,
) => {
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

const deleteProject = async (id: string) => {
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
