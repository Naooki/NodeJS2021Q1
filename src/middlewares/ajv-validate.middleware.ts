import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';

const ajv = new Ajv({ allErrors: true });
// @ts-ignore
addFormats(ajv, ['uuid']);

export class AjvValidatMiddleware {
  private static ajv = ajv;

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
