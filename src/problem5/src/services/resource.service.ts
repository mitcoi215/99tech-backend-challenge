import prisma from '../db/database';
import { Resource, ResourceFilter } from '../models/resource.model';
import { CreateResourceInput, UpdateResourceInput } from '../validators/resource.validator';

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
    return await prisma.resource.update({
      where: { id },
      data: dto,
    });
  } catch {
    // Prisma throws P2025 when record not found
    return null;
  }
}

export async function deleteResource(id: string): Promise<boolean> {
  try {
    await prisma.resource.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
