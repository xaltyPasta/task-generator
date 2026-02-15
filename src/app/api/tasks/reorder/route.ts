import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { reorderTasks } from "@/lib/services/reorder.service";

export async function POST(
  req: NextRequest
) {
  const userId = await requireAuth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  await reorderTasks(userId, body);

  return NextResponse.json({
    success: true,
  });
}

