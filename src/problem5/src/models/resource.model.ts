import { Resource as PrismaResource } from '@prisma/client';

// Re-export Prisma's generated type as our Resource type
export type Resource = PrismaResource;

export interface ResourceFilter {
  category?: string;
  status?: 'active' | 'inactive';
  search?: string;
  page?: number;
  limit?: number;
}
