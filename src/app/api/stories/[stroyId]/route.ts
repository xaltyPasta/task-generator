import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import {
  updateStory,
  deleteStory,
} from "@/lib/services/story.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title } =
      await req.json();

    await updateStory(
      params.storyId,
      userId,
      title
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const userId = await requireAuth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await deleteStory(
      params.storyId,
      userId
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}

