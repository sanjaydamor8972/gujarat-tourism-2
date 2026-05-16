import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

export async function uploadImageFile(file) {
  if (hasCloudinary) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'gujarat-tourism',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      caption: '',
    };
  }

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, file.buffer);

  const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return {
    url: `${baseUrl}/uploads/${filename}`,
    publicId: filename,
    caption: '',
  };
}
