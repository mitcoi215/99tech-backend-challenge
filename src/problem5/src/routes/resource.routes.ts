import { Router } from 'express';
import * as ResourceController from '../controllers/resource.controller';

const router = Router();

router.post('/', ResourceController.create);
router.get('/', ResourceController.list);
router.get('/:id', ResourceController.getOne);
router.patch('/:id', ResourceController.update);
router.delete('/:id', ResourceController.remove);

export default router;
