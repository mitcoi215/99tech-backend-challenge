import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as ResourceService from '../services/resource.service';
import {
  createResourceSchema,
  updateResourceSchema,
  listQuerySchema,
} from '../validators/resource.validator';

function formatZodError(err: ZodError): string {
  return err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createResourceSchema.parse(req.body);
    const resource = await ResourceService.createResource(dto);
    res.status(201).json(resource);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
      return;
    }
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filter = listQuerySchema.parse(req.query);
    const { data, total } = await ResourceService.listResources(filter);
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    res.json({
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
      return;
    }
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const resource = await ResourceService.getResourceById(req.params.id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found.' });
      return;
    }
    res.json(resource);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateResourceSchema.parse(req.body);
    const updated = await ResourceService.updateResource(req.params.id, dto);
    if (!updated) {
      res.status(404).json({ error: 'Resource not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
      return;
    }
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await ResourceService.deleteResource(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Resource not found.' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
