import { JSONSchemaType } from 'ajv';

import { Permission, GroupAttributes } from 'src/models/Group';

export const createGroupSchema: JSONSchemaType<Omit<GroupAttributes, 'id'>> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3 },
    permissions: {
      type: 'array',
      uniqueItems: true,
      items: { type: 'string', enum: Object.values(Permission) },
    },
  },
  required: ['name', 'permissions'],
  additionalProperties: false,
};

export const updateGroupSchema: JSONSchemaType<GroupAttributes> = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', minLength: 3 },
    permissions: {
      type: 'array',
      uniqueItems: true,
      items: { type: 'string', enum: Object.values(Permission) },
    },
  },
  required: ['id', 'name', 'permissions'],
  additionalProperties: false,
};
