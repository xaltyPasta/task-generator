import { prisma } from "@/lib/prisma";

export async function getUserRecentSpecs(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const specs = await prisma.spec.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return specs;
}

