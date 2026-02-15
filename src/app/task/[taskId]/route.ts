import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { updateTask } from "@/lib/services/task.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await updateTask(
      params.taskId,
      userId,
      body
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

