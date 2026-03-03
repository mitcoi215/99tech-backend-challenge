import { z } from 'zod';

const statusEnum = z.enum(['active', 'inactive']);

export const createResourceSchema = z.object({
  name: z.string().min(1, 'Name must not be empty').max(200),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).max(100).optional(),
  status: statusEnum.optional(),
});

export const updateResourceSchema = z
  .object({
    name: z.string().min(1, 'Name must not be empty').max(200).optional(),
    description: z.string().max(1000).nullable().optional(),
    category: z.string().min(1).max(100).optional(),
    status: statusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.',
  });

export const listQuerySchema = z.object({
  category: z.string().optional(),
  status: statusEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;
