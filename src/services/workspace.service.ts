import AppError from "../error/app-error";
import { Prisma } from "../generated/prisma/client";
import { Role } from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import { checkAuthorization } from "../lib/utils";

const createWorkspace = async (userId: string, name: string) => {
  const result = await prisma.$transaction(async (tx) => {
    let workspace;
    try {
      workspace = await tx.workspace.create({
        data: {
          name,
          ownerId: userId,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(409, "A workspace with this name already exists.");
      }

      throw error;
    }

    const member = await tx.workspaceMember.create({
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
  });

  return result;
};

const getWorkSpacesByUserId = async (userId: string) => {
  const workspaces = await prisma.workspaceMember.findMany({
    where: {
      userId,
    },
    select: {
      role: true,
      workspace: {
        select: { id: true, name: true },
      },
    },
  });

  const result = workspaces.map(({ role, workspace }) => ({
    id: workspace.id,
    name: workspace.name,
    role,
  }));

  return result;
};

const getWorkSpacesById = async (userId: string, workspaceId: string) => {
  let workspace = await prisma.workspace.findUnique({
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
      members: {
        select: { role: true, userId: true, user: { select: { name: true } } },
      },
      projects: true,
    },
  });

  if (!workspace) return workspace;

  return {
    ...workspace,
    members: workspace.members.map((member) => ({
      role: member.role,
      memberName: member.user.name,
      memberId: member.userId,
    })),
  };
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
        select: { name: true },
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
      workspace: { select: { name: true } },
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
        select: {
          id: true,
          role: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  const result = members?.members.map(({ id, role, user }) => ({
    id,
    role,
    name: user.name,
  }));

  return result;
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
      user: { select: { name: true } },
      workspace: {
        select: { name: true },
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
