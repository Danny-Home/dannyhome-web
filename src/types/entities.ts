export * from "../../prisma/interfaces";
import type { Attachment } from "../../prisma/interfaces";
export type WithImages<T> = T & { attachments?: Attachment[] };
