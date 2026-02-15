import { prisma } from "@/lib/prisma";

export async function createTask(
  storyId: string,
  userId: string,
  title: string
) {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: { spec: true },
  });

  if (!story || story.spec.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const lastTask = await prisma.task.findFirst({
    where: { storyId },
    orderBy: { order: "desc" },
  });

  const nextOrder = lastTask
    ? lastTask.order + 1
    : 1;

  return prisma.task.create({
    data: {
      title,
      storyId,
      order: nextOrder,
      status: "TODO",
    },
  });
}

export async function updateTask(
  taskId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    status?: "TODO" | "IN_PROGRESS" | "DONE";
  }
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      story: {
        include: { spec: true },
      },
    },
  });

  if (!task || task.story.spec.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
}

export async function deleteTask(
  taskId: string,
  userId: string
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      story: {
        include: { spec: true },
      },
    },
  });

  if (!task || task.story.spec.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.task.delete({
    where: { id: taskId },
  });
}
