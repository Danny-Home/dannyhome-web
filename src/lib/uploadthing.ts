import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { TAppFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<TAppFileRouter>();
export const UploadDropzone = generateUploadDropzone<TAppFileRouter>();
