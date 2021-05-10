import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { UserRole } from '../models/user.model';

interface TokenPayload {
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      userToken?: TokenPayload;
    }
  }
}

export function requireAuth(userRoles: UserRole[] = [UserRole.CUSTOMER]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenPayload = jwt.verify(
        req.cookies.jwt_encoded,
        process.env.JWT_SECRET!
      ) as TokenPayload;
      req.userToken = tokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!userRoles.includes(req.userToken.role))
      throw new UnauthorizedError('User not authorized');

    next();
  };
}
