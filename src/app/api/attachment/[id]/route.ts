// /app/api/attachment/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const a = await db.attachment.findUnique({
    where: { id: params.id },
    select: { data: true, mimeType: true },
  });
  if (!a) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(JSON.stringify(a.data), {
    headers: {
      "Content-Type": a.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
