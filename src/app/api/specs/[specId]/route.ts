import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { updateSpec } from "@/lib/services/spec.service";

type RouteContext = {
    params: Promise<{
        specId: string;
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

        const { specId } = await context.params;

        const body = await req.json();

        await updateSpec(specId, userId, body);

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("PATCH /api/specs/[specId] error:", error);

        return NextResponse.json(
            { error: "Failed to update spec" },
            { status: 500 }
        );
    }
}
