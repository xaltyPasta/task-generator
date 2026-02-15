import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth.service";
import { updateSpec } from "@/lib/services/spec.service";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { specId: string } }
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

        await updateSpec(
            params.specId,
            userId,
            body
        );

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Failed to update spec" },
            { status: 500 }
        );
    }
}
