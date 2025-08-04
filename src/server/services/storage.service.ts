import type { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import type { Base64FileInput, UploadedFileMeta } from "@/lib/schemas/storage";

/**
 * No S3, no external URLs.
 * - Stores the binary (BYTEA) in `attachment.data`
 * - Keeps full metadata (mimeType, size, original filename)
 * - Returns a URL that points to your Next.js API handler
 *   e.g. `/api/attachment/<id>`
 */
export const storageService = {
  /* ------------------------------------------------------------------ */
  /*  Upload one or many files                                          */
  /* ------------------------------------------------------------------ */
  async upload(
    db: PrismaClient,
    files: Base64FileInput[],
    uploaderId?: string,
  ): Promise<UploadedFileMeta[]> {
    const saved: UploadedFileMeta[] = [];

    for (const f of files) {
      const buffer = Buffer.from(f.data, "base64");

      const attachment = await db.attachment.create({
        data: {
          id: uuidv4(),
          filename: f.name,
          mimeType: f.type,
          size: buffer.byteLength,
          data: buffer,
          ...(uploaderId ? { uploaderId } : {}), // ➜ only when valid
        },
        select: { id: true, mimeType: true, size: true, filename: true },
      });

      saved.push({
        id: attachment.id,
        name: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
        url: `/api/attachment/${attachment.id}`,
        key: "",
      });
    }

    return saved;
  },

  async remove(db: PrismaClient, id: string) {
    await db.attachment.delete({ where: { id } });
    return { deleted: true, id };
  },
};
