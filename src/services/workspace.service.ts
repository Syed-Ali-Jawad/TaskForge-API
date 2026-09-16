import { Role } from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import { checkAuthorization } from "../lib/utils";

const createWorkspace = async (userId: string, name: string) => {
  const workspace = await prisma.workspace.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const member = await prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId: workspace.id,
      role: Role.OWNER,
    },
    select: {
      userId: true,
      role: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return { ...workspace, members: [member] };
};

const getWorkSpacesByUserId = async (userId: string) => {
  const workspaces = await prisma.workspaceMember.findMany({
    where: {
      userId,
    },
    select: {
      role: true,
      workspace: {
        id: true,
        name: true,
      },
    },
  });

  return workspaces;
};

const getWorkSpacesById = async (userId: string, workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      members: {
        some: {
          userId,
        },
      },
    },
  });

  return workspace;
};

const updateWorkspaceById = async (
  workspaceId: string,
  userId: string,
  name: string,
) => {
  const updatedWorkspace = await prisma.workspace.update({
    data: {
      name,
    },
    where: {
      id: workspaceId,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return updatedWorkspace;
};

const deleteWorkspace = async (id: string, userId: string) => {
  const deletedWorkspace = await prisma.workspace.delete({
    where: {
      id,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return deletedWorkspace;
};

const updateWorkspaceMember = async (
  userId: string,
  workspaceId: string,
  role: Role,
) => {
  const updatedMember = await prisma.workspaceMember.updateManyAndReturn({
    data: {
      role,
    },
    where: {
      workspaceId,
      userId,
    },
    select: {
      workspace: {
        name: true,
      },
      role: true,
    },
  });

  return updatedMember;
};

const addWorkspaceMember = async (
  userId: string,
  workspaceId: string,
  role: Role,
) => {
  await checkAuthorization(userId, workspaceId);
  const addedMember = await prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId,
      role,
    },
    select: {
      workspace: { name: true },
      role: true,
    },
  });

  return addedMember;
};

const getWorkspaceMembers = async (workspaceId: string) => {
  const members = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    select: {
      members: {
        id: true,
        name: true,
        role: true,
      },
    },
  });

  return members;
};

const deleteMemberFromWorkspace = async (
  workspaceId: string,
  userId: string,
) => {
  await checkAuthorization(userId, workspaceId);
  const deletedMember = await prisma.workspaceMember.delete({
    where: {
      userId_workspaceId: {
        workspaceId,
        userId,
      },
    },
    select: {
      user: { name: true },
      workspace: {
        name: true,
      },
    },
  });

  return deletedMember;
};

export {
  createWorkspace,
  getWorkSpacesByUserId,
  getWorkSpacesById,
  updateWorkspaceById,
  deleteWorkspace,
  updateWorkspaceMember,
  addWorkspaceMember,
  deleteMemberFromWorkspace,
  getWorkspaceMembers,
};
