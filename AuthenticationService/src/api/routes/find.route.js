import express from 'express';
import FindService from '../services/find.service';

const router = express.Router();

router.route('/:userId').get(FindService.findUserById);

export default router;
