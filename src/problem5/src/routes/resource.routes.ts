import { Router } from 'express';
import * as ResourceController from '../controllers/resource.controller';
import { writeLimiter } from '../middlewares/rateLimiters';

const router = Router();

// Read operations — covered only by the global 100 req/min limiter.
router.get('/', ResourceController.list);
router.get('/:id', ResourceController.getOne);

// Write operations — additionally capped at 30 req/min per IP.
router.post('/', writeLimiter, ResourceController.create);
router.patch('/:id', writeLimiter, ResourceController.update);
router.delete('/:id', writeLimiter, ResourceController.remove);

export default router;
