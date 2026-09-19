import {
  PrismaClient,
  Role,
  TaskPriority,
  TaskStatus,
} from "../src/generated/prisma/client";
import bcrypt from "bcrypt";
import { PrismaClientOptions } from "../src/generated/prisma/internal/prismaNamespace";
import env from "../src/config/env";

const prisma = new PrismaClient({} as PrismaClientOptions);

async function main() {
  // Clear existing seed data
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  // Password shared by all seed users
  const hashedPassword = await bcrypt.hash(env.seedPassword, 10);

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  const user1 = await prisma.user.create({
    data: {
      name: "Ali Jawad",
      email: "aaa@aaa.com",
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "User 2",
      email: "aaa@bbb.com",
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "User 3",
      email: "aaa@ccc.com",
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Workspaces
  // ---------------------------------------------------------------------------

  const workspace1 = await prisma.workspace.create({
    data: {
      name: "Main Workspace",
    },
    select: {
      id: true,
    },
  });

  const workspace2 = await prisma.workspace.create({
    data: {
      name: "Secondary Workspace",
    },
    select: {
      id: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Workspace Members
  // ---------------------------------------------------------------------------

  await prisma.workspaceMember.createMany({
    data: [
      {
        userId: user1.id,
        workspaceId: workspace1.id,
        role: Role.OWNER,
      },
      {
        userId: user2.id,
        workspaceId: workspace1.id,
        role: Role.ADMIN,
      },
      {
        userId: user3.id,
        workspaceId: workspace1.id,
        role: Role.MEMBER,
      },
    ],
  });

  await prisma.workspaceMember.createMany({
    data: [
      {
        userId: user1.id,
        workspaceId: workspace2.id,
        role: Role.ADMIN,
      },
      {
        userId: user2.id,
        workspaceId: workspace2.id,
        role: Role.OWNER,
      },
      {
        userId: user3.id,
        workspaceId: workspace2.id,
        role: Role.MEMBER,
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // Projects
  // Only Main Project will contain tasks.
  // ---------------------------------------------------------------------------

  const project1 = await prisma.project.create({
    data: {
      name: "Main Project",
      shortKey: "MP",
      workspaceId: workspace1.id,
    },
    select: {
      id: true,
    },
  });

  // Empty project
  await prisma.project.create({
    data: {
      name: "Secondary Project",
      shortKey: "SP",
      workspaceId: workspace1.id,
    },
  });

  // Empty project in another workspace
  await prisma.project.create({
    data: {
      name: "Workspace 2 Project",
      shortKey: "W2P",
      workspaceId: workspace2.id,
    },
  });

  // ---------------------------------------------------------------------------
  // Tasks
  // All tasks belong to Main Project.
  // ---------------------------------------------------------------------------

  const task1 = await prisma.task.create({
    data: {
      title: "Main Task",
      reporterId: user1.id,
      projectId: project1.id,
    },
    select: {
      id: true,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Build authentication",
        reporterId: user1.id,
        assigneeId: user2.id,
        projectId: project1.id,
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      },
      {
        title: "Create dashboard",
        reporterId: user1.id,
        assigneeId: user3.id,
        projectId: project1.id,
      },
      {
        title: "Add task filtering",
        reporterId: user2.id,
        assigneeId: user1.id,
        projectId: project1.id,
        priority: TaskPriority.LOW,
      },
      {
        title: "Implement pagination",
        reporterId: user2.id,
        assigneeId: user3.id,
        projectId: project1.id,
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      },
      {
        title: "Add search functionality",
        reporterId: user3.id,
        assigneeId: user2.id,
        projectId: project1.id,
        status: TaskStatus.DONE,
      },
      {
        title: "Validate task input",
        reporterId: user1.id,
        assigneeId: user2.id,
        projectId: project1.id,
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
      },
      {
        title: "Handle task permissions",
        reporterId: user3.id,
        projectId: project1.id,
        priority: TaskPriority.HIGH,
      },
      {
        title: "Improve error handling",
        reporterId: user2.id,
        assigneeId: user1.id,
        projectId: project1.id,
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.LOW,
      },
      {
        title: "Add sorting",
        reporterId: user1.id,
        assigneeId: user3.id,
        projectId: project1.id,
      },
      {
        title: "Write API documentation",
        reporterId: user3.id,
        assigneeId: user1.id,
        projectId: project1.id,
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // Comments
  // Only Main Task has comments.
  // ---------------------------------------------------------------------------

  await prisma.comment.createMany({
    data: [
      {
        comment: "Some comment",
        taskId: task1.id,
        authorId: user1.id,
      },
      {
        comment: "I'll start working on this.",
        taskId: task1.id,
        authorId: user2.id,
      },
      {
        comment: "The requirements look clear.",
        taskId: task1.id,
        authorId: user3.id,
      },
      {
        comment: "I've completed the initial implementation.",
        taskId: task1.id,
        authorId: user2.id,
      },
      {
        comment: "Please review the latest changes.",
        taskId: task1.id,
        authorId: user1.id,
      },
      {
        comment: "Found a small issue that needs to be fixed.",
        taskId: task1.id,
        authorId: user3.id,
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
