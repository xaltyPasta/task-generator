import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import {
  updateStory,
  deleteStory,
} from "@/lib/services/story.service";

type RouteContext = {
  params: Promise<{
    storyId: string;
  }>;
};

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { storyId } = await context.params;
    const { title } = await req.json();

    await updateStory(storyId, userId, title);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PATCH /api/stories/[storyId] error:",
      error
    );

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { storyId } = await context.params;

    await deleteStory(storyId, userId);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE /api/stories/[storyId] error:",
      error
    );

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
