import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { updateTask, deleteTask } from "@/lib/services/task.service";

// Use the built-in Next.js type for cleaner handling
interface RouteContext {
  params: Promise<{ taskId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    // 1. Resolve params first
    const resolvedParams = await params;
    const taskId = resolvedParams?.taskId;

    if (!taskId) {
      return NextResponse.json({ error: "Route parameter taskId missing" }, { status: 400 });
    }

    // 2. Auth (Ensure this doesn't consume req.json())
    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Read body safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
    }

    await updateTask(taskId, userId, body);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { taskId } = await params;

    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteTask(taskId, userId);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}