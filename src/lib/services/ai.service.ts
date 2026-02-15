import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const MODEL = "llama-3.3-70b-versatile";

type GenerateInput = {
  specId: string;
  userId: string;
};

// helper to clean ```json blocks
function extractJson(text: string): string {
  let trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    trimmed = trimmed.replace(/^```(?:json)?/i, "").trim();
    trimmed = trimmed.replace(/```$/, "").trim();
  }

  return trimmed;
}

export async function generateStoriesAndTasks({
  specId,
  userId,
}: GenerateInput) {
  const spec = await prisma.spec.findUnique({
    where: { id: specId },
  });

  if (!spec || spec.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const systemPrompt = `
You are a senior product manager and software architect.

Your task:
Generate structured user stories and engineering tasks.

Rules:
- Respond ONLY with valid JSON.
- No markdown.
- No explanation.
- No extra text.

Output format:

{
  "stories": [
    {
      "title": "User story title",
      "tasks": [
        { "title": "Task title" }
      ]
    }
  ]
}
`.trim();

  const userPrompt = `
Feature Specification:

Title: ${spec.title}
Goal: ${spec.goal}
Target Users: ${spec.targetUsers}
Constraints: ${spec.constraints ?? "None"}
Risks: ${spec.risks ?? "None"}

Generate 4–6 high-quality user stories.
Each story must contain 3–5 engineering tasks.
`.trim();

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("Groq returned empty response");
  }

  const jsonText = extractJson(raw);

  let parsed: any;

  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    console.error(
      "Groq JSON parse error:",
      err,
      jsonText
    );
    throw new Error("Invalid JSON from Groq");
  }

  if (!Array.isArray(parsed.stories)) {
    throw new Error("Invalid AI output structure");
  }

  // 🔥 Store generation metadata
  await prisma.specGeneration.create({
    data: {
      specId,
      model: MODEL,
      temperature: 0.4,
      prompt: userPrompt,
      rawResponse: JSON.parse(JSON.stringify(completion)),
      parsedOutput: parsed,
    },
  });

  // 🔥 Persist stories + tasks
  for (let i = 0; i < parsed.stories.length; i++) {
    const storyData = parsed.stories[i];

    const story = await prisma.story.create({
      data: {
        title: storyData.title,
        specId,
        order: i + 1,
      },
    });

    if (Array.isArray(storyData.tasks)) {
      for (let j = 0; j < storyData.tasks.length; j++) {
        await prisma.task.create({
          data: {
            title: storyData.tasks[j].title,
            storyId: story.id,
            order: j + 1,
            status: "TODO",
          },
        });
      }
    }
  }

  return { success: true };
}
