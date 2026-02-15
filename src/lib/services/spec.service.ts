import { prisma } from "@/lib/prisma";
import { generateStoriesAndTasks } from "./ai.service";

export type CreateSpecInput = {
  title: string;
  goal: string;
  targetUsers: string;
  constraints?: string;
  risks?: string;
  templateType: "WEB" | "MOBILE" | "INTERNAL_TOOL";
  userId: string;
};

export async function createSpec(
  data: CreateSpecInput
) {
  // 1️⃣ Create Spec
  const spec = await prisma.spec.create({
    data: {
      title: data.title,
      goal: data.goal,
      targetUsers: data.targetUsers,
      constraints: data.constraints,
      risks: data.risks,
      templateType: data.templateType,
      userId: data.userId,
    },
  });

  // 2️⃣ Auto-generate stories/tasks
  await generateStoriesAndTasks({
    specId: spec.id,
    userId: data.userId,
  });

  return spec;
}

export async function getSpecById(
  specId: string,
  userId: string
) {
  return prisma.spec.findFirst({
    where: {
      id: specId,
      userId,
    },
    include: {
      stories: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}


export async function updateSpec(
  specId: string,
  userId: string,
  data: {
    title?: string;
    goal?: string;
    targetUsers?: string;
    constraints?: string;
    risks?: string;
  }
) {
  return prisma.spec.updateMany({
    where: {
      id: specId,
      userId,
    },
    data,
  });
}


