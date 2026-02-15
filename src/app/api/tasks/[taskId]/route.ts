import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import {
  updateTask,
  deleteTask,
} from "@/lib/services/task.service";

type Context = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function PATCH(
  req: NextRequest,
  context: Context
) {
  try {
    const { taskId } = await context.params;

    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await updateTask(taskId, userId, body);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: Context
) {
  try {
    const { taskId } = await context.params;

    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await deleteTask(taskId, userId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
