/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

// export const cloudinary = cloudinaryV2.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// import { v2 as cloudinary } from 'cloudinary';

export async function uploadImageBase64(
  base64: string,
  folderName: string,
  filename?: string,
) {
  const b64 = base64.startsWith('data:')
    ? base64.split(',')[1]
    : base64.replace(/^base64,/, '').replace(/\s+/g, '');

  const buf = Buffer.from(b64!, 'base64');

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const s = cloudinary.uploader.upload_stream(
      { folder: folderName, public_id: filename, overwrite: true, resource_type: 'image' },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    s.end(buf);
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
