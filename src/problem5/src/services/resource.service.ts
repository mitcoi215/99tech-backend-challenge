import { Prisma } from '@prisma/client';
import prisma from '../db/database';
import { Resource, ResourceFilter } from '../models/resource.model';
import { CreateResourceInput, UpdateResourceInput } from '../validators/resource.validator';

/** True when `err` is a Prisma "record not found" error (P2025). */
function isNotFound(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025';
}

export async function createResource(dto: CreateResourceInput): Promise<Resource> {
  return prisma.resource.create({
    data: {
      name: dto.name,
      description: dto.description ?? null,
      category: dto.category ?? 'general',
      status: dto.status ?? 'active',
    },
  });
}

export async function listResources(
  filter: ResourceFilter,
): Promise<{ data: Resource[]; total: number }> {
  const page = Math.max(1, filter.page ?? 1);
  const limit = Math.min(100, Math.max(1, filter.limit ?? 20));

  const where = {
    ...(filter.category ? { category: filter.category } : {}),
    ...(filter.status ? { status: filter.status } : {}),
    ...(filter.search
      ? {
          OR: [
            { name: { contains: filter.search } },
            { description: { contains: filter.search } },
          ],
        }
      : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.resource.count({ where }),
  ]);

  return { data, total };
}

export async function getResourceById(id: string): Promise<Resource | null> {
  return prisma.resource.findUnique({ where: { id } });
}

export async function updateResource(
  id: string,
  dto: UpdateResourceInput,
): Promise<Resource | null> {
  try {
    return await prisma.resource.update({ where: { id }, data: dto });
  } catch (err) {
    // Return null only for "record not found" — re-throw anything else
    // (connection errors, constraint violations, …) so the global error
    // handler can return a proper 500 instead of a misleading 404.
    if (isNotFound(err)) return null;
    throw err;
  }
}

export async function deleteResource(id: string): Promise<boolean> {
  try {
    await prisma.resource.delete({ where: { id } });
    return true;
  } catch (err) {
    if (isNotFound(err)) return false;
    throw err;
  }
}
