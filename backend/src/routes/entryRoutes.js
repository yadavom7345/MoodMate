import express from 'express';
import { createEntry, getEntries } from '../controllers/entryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getEntries)
    .post(protect, createEntry);

export default router;
