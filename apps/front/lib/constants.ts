export const BACKEND_URL = process.env.BACKEND_URL;
export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const secretKey = process.env.SESSION_SECRET_KEY!;
export const encodedKey = new TextEncoder().encode(secretKey);
export const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
