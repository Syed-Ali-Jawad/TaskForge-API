import AppError from "../error/app-error";
import { Role } from "../generated/prisma/enums";
import prisma from "./prisma";

export const checkAuthorization = async (
  userId: string,
  workspaceId: string,
) => {
  const userRole = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    select: {
      role: true,
    },
  });

  if (userRole?.role === Role.MEMBER) {
    throw new AppError(403, "Forbidden");
  }
};
