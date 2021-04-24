import Ajv, { JSONSchemaType } from 'ajv';
import { Request, Response, NextFunction } from 'express';

export class AjvValidatMiddleware {
  private static ajv = new Ajv({ allErrors: true });

  static getMiddleware<T>(schema: JSONSchemaType<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
      const validateFn = AjvValidatMiddleware.ajv.compile(schema);

      if (validateFn(req.body)) {
        next();
      } else {
        next(validateFn.errors);
      }
    };
  }
}
