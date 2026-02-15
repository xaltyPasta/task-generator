import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { updateTask, deleteTask } from "@/lib/services/task.service";

// Ensure this matches your file path: app/api/task/[taskId]/route.ts
type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    // 1. Await the params (Required in Next.js 15+)
    const { taskId } = await context.params;

    // 2. Authentication check
    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Parse and validate body
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    // 4. Perform update
    await updateTask(taskId, userId, body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /task/[taskId] error:", error);
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { taskId } = await context.params;

    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Perform deletion
    await deleteTask(taskId, userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /task/[taskId] error:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}