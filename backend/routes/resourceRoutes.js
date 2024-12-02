import express from 'express';
import { protect, roleCheck } from '../middleware/authMiddleware.js';
import { createResource, getResource, updateResource } from '../controllers/resourceController.js';

const router = express.Router();

router.route('/:id')
    .get(getResource)
    .put(protect, roleCheck, updateResource)

export default router;
