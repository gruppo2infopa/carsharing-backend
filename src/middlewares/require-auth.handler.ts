import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized.error';

interface TokenPayload {
  userEmail: string;
}

declare global {
  namespace Express {
    interface Request {
      userToken?: TokenPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenPayload = jwt.verify(
      req.cookies.jwt_encoded,
      process.env.JWT_SECRET!
    ) as TokenPayload;
    req.userToken = tokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Authentication required');
  }

  next();
};
