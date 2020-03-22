import { Request, Response, NextFunction } from 'express';
import { OK } from 'http-status';

export function jsonResponse(req: Request, res: Response, next: NextFunction) {
    
  res.jsonResponse = (data: any = null, errors: string[] = [], success: boolean = true, status: number = OK) => {
      return res.status(status).json({ data, errors, success, statusCode: status });
  };

  next();
}
