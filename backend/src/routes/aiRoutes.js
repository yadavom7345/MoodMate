import express from 'express';
import { analyzeEntry, semanticSearch } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', analyzeEntry);
router.post('/search', protect, semanticSearch);

export default router;
