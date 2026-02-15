import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth.service";

type Context = {
  params: Promise<{
    specId: string;
  }>;
};

function buildMarkdown(spec: any) {
  let md = `# ${spec.title}\n\n`;

  md += `## Overview\n\n`;
  md += `**Goal:** ${spec.goal}\n\n`;
  md += `**Target Users:** ${spec.targetUsers}\n\n`;

  if (spec.constraints) {
    md += `**Constraints:** ${spec.constraints}\n\n`;
  }

  if (spec.risks) {
    md += `**Risks:** ${spec.risks}\n\n`;
  }

  md += `---\n\n`;
  md += `# User Stories\n\n`;

  spec.stories.forEach((story: any, i: number) => {
    md += `## ${i + 1}. ${story.title}\n\n`;

    if (story.tasks.length > 0) {
      md += `### Engineering Tasks\n\n`;

      story.tasks.forEach((task: any, j: number) => {
        md += `- [ ] ${task.title}  \n`;
        md += `  Status: ${task.status}\n`;
      });

      md += `\n`;
    }
  });

  return md;
}

export async function GET(
  req: NextRequest,
  context: Context
) {
  const { specId } = await context.params;

  const userId = await requireAuth();
  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const spec = await prisma.spec.findUnique({
    where: { id: specId },
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

  if (!spec || spec.userId !== userId) {
    return new Response("Not found", {
      status: 404,
    });
  }

  const markdown = buildMarkdown(spec);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="${spec.title
        .replace(/\s+/g, "-")
        .toLowerCase()}.md"`,
    },
  });
}

