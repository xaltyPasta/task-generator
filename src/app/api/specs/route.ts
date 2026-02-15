import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { createSpec } from "@/lib/services/spec.service";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const spec = await createSpec({
      ...body,
      userId,
    });

    return NextResponse.json(spec);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create spec" },
      { status: 500 }
    );
  }
}
