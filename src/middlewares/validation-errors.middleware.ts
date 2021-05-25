import { DefinedError } from 'ajv';
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

@injectable()
export class ValidationErrorMiddleware {
  handler(errors: unknown, req: Request, res: Response, next: NextFunction) {
    if (Array.isArray(errors) && errors.every(isDefinedError)) {
      res.status(400);
      res.json(errors);
      next();
    } else {
      next(errors);
    }
  }
}

function isDefinedError(err: any): err is DefinedError {
  return err?.keyword;
}
