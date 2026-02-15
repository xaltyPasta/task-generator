import { prisma } from "@/lib/prisma";

export async function reorderTasks(
  userId: string,
  updates: Array<{
    taskId: string;
    storyId: string;
    order: number;
  }>
) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Validate ownership first
    for (const update of updates) {
      const task = await tx.task.findUnique({
        where: { id: update.taskId },
        include: {
          story: {
            include: { spec: true },
          },
        },
      });

      if (
        !task ||
        task.story.spec.userId !== userId
      ) {
        throw new Error("Unauthorized");
      }
    }

    // 2️⃣ Move everything to temporary negative order
    for (const update of updates) {
      await tx.task.update({
        where: { id: update.taskId },
        data: {
          order: -update.order, // temporary safe space
        },
      });
    }

    // 3️⃣ Apply final order
    for (const update of updates) {
      await tx.task.update({
        where: { id: update.taskId },
        data: {
          storyId: update.storyId,
          order: update.order,
        },
      });
    }
  });
}
