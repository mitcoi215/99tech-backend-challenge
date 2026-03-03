import { OpenAPIV3 } from 'openapi-types';

const resourceSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
    name: { type: 'string', example: 'My Resource' },
    description: { type: 'string', nullable: true, example: 'An optional description' },
    category: { type: 'string', example: 'tools' },
    status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const errorSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: { error: { type: 'string' } },
};

const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Problem 5 — Crude Server API',
    version: '1.0.0',
    description: 'A CRUD REST API built with ExpressJS, TypeScript, Prisma, and SQLite.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local development' }],
  paths: {
    '/resources': {
      post: {
        summary: 'Create a resource',
        tags: ['Resources'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'My Resource' },
                  description: { type: 'string', example: 'An optional description' },
                  category: { type: 'string', example: 'tools' },
                  status: { type: 'string', enum: ['active', 'inactive'] },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Resource created',
            content: { 'application/json': { schema: resourceSchema } },
          },
          '400': {
            description: 'Validation error',
            content: { 'application/json': { schema: errorSchema } },
          },
        },
      },
      get: {
        summary: 'List resources',
        tags: ['Resources'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive'] } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search name or description' },
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of resources',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: resourceSchema },
                    meta: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total_pages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/resources/{id}': {
      get: {
        summary: 'Get a resource by ID',
        tags: ['Resources'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Resource found', content: { 'application/json': { schema: resourceSchema } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
      patch: {
        summary: 'Update a resource',
        tags: ['Resources'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  category: { type: 'string' },
                  status: { type: 'string', enum: ['active', 'inactive'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Resource updated', content: { 'application/json': { schema: resourceSchema } } },
          '400': { description: 'Validation error', content: { 'application/json': { schema: errorSchema } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
      delete: {
        summary: 'Delete a resource',
        tags: ['Resources'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Deleted successfully' },
          '404': { description: 'Not found', content: { 'application/json': { schema: errorSchema } } },
        },
      },
    },
  },
};

export default swaggerDocument;
