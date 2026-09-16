import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      workspaces: { name: true, role: true },
      tasks: { title: true, status: true, dueDate: true },
    },
  });

  return user;
};

const updateUser = async (userId: string, name?: string, password?: string) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(name && { name }),
      ...(password && { password: hashedPassword }),
    },
  });

  return updatedUser;
};

export { getUser, updateUser };
