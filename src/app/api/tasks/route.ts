import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { createTask } from "@/lib/services/task.service";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { storyId, title } = await req.json();

    const task = await createTask(
      storyId,
      userId,
      title
    );

    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
