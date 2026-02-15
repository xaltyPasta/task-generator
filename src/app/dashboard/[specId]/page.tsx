export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/services/auth.service";
import { getSpecById } from "@/lib/services/spec.service";
import SpecDetailClient from "@/components/SpecDetailClient";

type Props = {
  params: Promise<{
    specId: string;
  }>;
};

export default async function SpecDetailPage({
  params,
}: Props) {
  const { specId } = await params;

  const userId = await requireAuth();

  if (!userId) {
    notFound();
  }

  const spec = await getSpecById(
    specId,
    userId
  );

  if (!spec) {
    notFound();
  }

  return <SpecDetailClient spec={spec} />;
}
