import z from "zod";


export interface Base64FileInput {
  name: string;
  type: string;
  data: string;          // Base64 string
}

export interface UploadedFileMeta {
  key: string;
  url: string;
  mimeType: string;
  size: number;
  id: string;
  name: string;
}

export const fileRequestSchema = z.object({
  name: z.string(),
  type: z.string(),
  data: z.string().base64url()
})

export type TFileRequestSchema = z.infer<typeof fileRequestSchema>
