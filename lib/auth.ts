import jwt from 'jsonwebtoken';

export function verifyToken(token: string | undefined): number | null {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as { userId: number };
    return decoded.userId;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

