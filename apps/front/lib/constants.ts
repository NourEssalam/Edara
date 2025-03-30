export const BACKEND_URL = process.env.BACKEND_URL;
const secretKey = process.env.SESSION_SECRET_KEY!;
export const encodedKey = new TextEncoder().encode(secretKey);
