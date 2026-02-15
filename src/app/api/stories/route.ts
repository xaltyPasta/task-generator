import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { createStory } from "@/lib/services/story.service";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { specId, title } = await req.json();

    const story = await createStory(
      specId,
      userId,
      title
    );

    return NextResponse.json(
      story,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/stories error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
