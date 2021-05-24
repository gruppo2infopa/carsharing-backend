import { Request, Response, NextFunction } from 'express';

export function multipartParse(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = field as keyof typeof req.body;
    req.body[key] = JSON.parse(req.body[key]);
    next();
  };
}
