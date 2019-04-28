import express from 'express';
import interService from '../services/inter.service';

const router = express.Router();

/**
 * @param {*} req.query - id
 */
router.get('/groups/check/:groupId', interService.checkUserOfGroup);

export default router;
