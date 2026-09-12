import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "../lib/jwt";
import { Prisma } from "../generated/prisma/client";

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid password");
  }

  const token = signToken({ userId: user.id });

  return { user, token };
};

const registerUser = async (email: string, password: string, name: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: { id: true, email: true, name: true },
    });
    return user;
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      prismaError.code === "P2002"
    ) {
      throw new AppError(409, "Email already exists");
    }
    throw new AppError(500, "Error registering user");
  }
};

export { loginUser, registerUser };
