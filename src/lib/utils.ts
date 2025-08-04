import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { base64FileInput } from './schemas/product';
import type { Base64FileInput } from "@/lib/schemas/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

/**
 * readFilesAsBase64
 * -----------------
 * Converts File objects into the structure expected by storageRouter.upload.
 *
 * @param files Array<File> – usually from input.files
 * @returns Promise<{ name: string; type: string; data: string; }[]>
 */
export async function readFilesAsBase64(
  files: File[],
): Promise<
  Base64FileInput[]
> {
  /** read a single file */
  const readOne = (file: File) =>
    new Promise<{
      name: string;
      type: string;
      data: string;
    }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",", 2)[1] ?? "";
        resolve({ name: file.name, type: file.type, data: base64 });
      };
      reader.readAsDataURL(file);
    });

  return Promise.all(files.map(readOne));
}

type StoredFile = {
  name: string;
  type: string;   // mime-type (image/png, image/jpeg, ...)
  data: string;   // base-64 *without* `"data:..."` prefix
};

export function buildViewableUrl(
  file: StoredFile,
  opts: { useBlob?: boolean } = {},
): string {
  // 1) convert base64 → binary string → Uint8Array
  const binary = atob(file.data);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

  if (opts.useBlob) {
    // Blob + ObjectURL
    const blob = new Blob([bytes], { type: file.type });
    return URL.createObjectURL(blob); // remember to revoke when done!
  }

  // default: data-URL
  return `data:${file.type};base64,${file.data}`;
}

/* ----------------------------------------------------------
   Helper to clean up any blob-URLs when a component unmounts
   (call this inside a React useEffect cleanup, for example)
---------------------------------------------------------- */
export function revokeIfBlob(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}
