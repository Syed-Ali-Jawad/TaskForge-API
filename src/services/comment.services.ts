import prisma from "../lib/prisma";

const updateComment = async (
  userId: string,
  taskId: string,
  commentId: string,
  comment: string,
) => {
  const updatedComment = await prisma.comment.update({
    where: {
      taskId,
      id: commentId,
      authorId: userId,
    },
    data: { comment },
    select: {
      id: true,
      comment: true,
      author: { select: { name: true } },
      updatedAt: true,
    },
  });

  return updatedComment;
};

const addComment = async (
  taskId: string,
  authorId: string,
  comment: string,
) => {
  const addedComment = await prisma.comment.create({
    data: {
      comment,
      authorId,
      taskId,
    },
    select: {
      id: true,
      comment: true,
      author: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  return addedComment;
};

const deleteComment = async (
  userId: string,
  taskId: string,
  commentId: string,
) => {
  const deletedComment = await prisma.comment.delete({
    where: {
      authorId: userId,
      taskId,
      id: commentId,
    },
    select: {
      author: { select: { name: true } },
    },
  });

  return deletedComment;
};

export { updateComment, addComment, deleteComment };
