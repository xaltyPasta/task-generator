import { prisma } from "@/lib/prisma";

export async function createStory(
  specId: string,
  userId: string,
  title: string
) {
  // Verify ownership
  const spec = await prisma.spec.findUnique({
    where: { id: specId },
  });

  if (!spec || spec.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Get max order
  const lastStory = await prisma.story.findFirst({
    where: { specId },
    orderBy: { order: "desc" },
  });

  const nextOrder = lastStory ? lastStory.order + 1 : 1;

  return prisma.story.create({
    data: {
      title,
      specId,
      order: nextOrder,
    },
  });
}

export async function updateStory(
  storyId: string,
  userId: string,
  title: string
) {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      spec: true,
    },
  });

  if (!story || story.spec.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.story.update({
    where: { id: storyId },
    data: { title },
  });
}

export async function deleteStory(
  storyId: string,
  userId: string
) {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: { spec: true },
  });

  if (!story || story.spec.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.story.delete({
    where: { id: storyId },
  });
}

