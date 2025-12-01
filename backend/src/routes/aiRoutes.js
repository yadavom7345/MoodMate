import express from 'express';
import { analyzeEntry, semanticSearch } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', analyzeEntry);
router.post('/search', semanticSearch);

export default router;
