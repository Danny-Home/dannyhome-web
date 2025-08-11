import { v2 as cloudinaryV2 } from "cloudinary";

export const cloudinary = cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function uploadImageBase64(
  base64: string,
  folderName: string,
  filename?: string,
) {
  const result = await cloudinary.uploader.upload(base64, {
    folder: folderName,
    public_id: filename,
    overwrite: true,
  });
  return {
    filename: result.original_filename,
    mimeType: result.format,
    size: result.bytes,
    width: result.width,
    height: result.height,
    publicId: result.public_id,
    url: result.secure_url,
  };
}
