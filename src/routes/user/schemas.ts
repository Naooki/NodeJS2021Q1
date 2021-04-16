import { JSONSchemaType } from 'ajv';

import { UserAttributes } from 'src/models/User';

export const createUserSchema: JSONSchemaType<
  Omit<UserAttributes, 'id' | 'isDeleted'>
> = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 64,
      pattern: '^(?=.*[a-zA-Z])(?=.*[0-9])',
    },
    age: { type: 'number', minimum: 4, maximum: 130 },
  },
  required: ['login', 'password', 'age'],
  additionalProperties: false,
};

export const patchUserSchema: JSONSchemaType<
  Omit<UserAttributes, 'id' | 'isDeleted'>
> = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 64,
      pattern: '^(?=.*[a-zA-Z])(?=.*[0-9])',
    },
    age: { type: 'number', minimum: 4, maximum: 130 },
  },
  minProperties: 1,
  required: [],
  additionalProperties: false,
};
