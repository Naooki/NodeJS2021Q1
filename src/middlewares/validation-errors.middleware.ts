import { DefinedError } from 'ajv';
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

@injectable()
export class ValidationErrorMiddleware {
  handler(
    errors: DefinedError[],
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    res.status(400);
    res.json(errors);
    next();
  }
}
