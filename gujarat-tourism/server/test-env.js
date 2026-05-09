import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('📁 .env path:', path.join(__dirname, '.env'));
console.log('📧 MONGO_URI:', process.env.MONGO_URI);
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('🚪 PORT:', process.env.PORT);