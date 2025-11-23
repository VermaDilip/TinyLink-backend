import express from 'express';
import linkController from '../controllers/link.controller.js';
import validateCode from '../middleware/validateCode.js';

const router = express.Router();

// Create link
router.post('/', linkController.createLink);

// Get all links
router.get('/', linkController.getAllLinks);

// Get link stats
router.get('/:code', validateCode, linkController.getLinkStats);

// Delete link
router.delete('/:code', validateCode, linkController.deleteLink);

// Redirect
router.get('/:code/redirect', validateCode, linkController.redirectLink);

export default router;