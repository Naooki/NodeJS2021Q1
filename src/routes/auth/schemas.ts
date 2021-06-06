import { JSONSchemaType } from 'ajv';

export const loginSchema: JSONSchemaType<{
  login: string;
  password: string;
}> = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 64,
      pattern: '^(?=.*[a-zA-Z])(?=.*[0-9])',
    },
  },
  required: ['login', 'password'],
  additionalProperties: false,
};
