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
      comment: true,
      author: { name: true },
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
      comment: true,
      author: { name: true },
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
      id: true,
    },
  });

  return deleteComment;
};

export { updateComment, addComment, deleteComment };
