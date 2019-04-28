import express from 'express';
import SearchService from '../services/search.service';

const router = express.Router();

router.route('/').get(SearchService.getUsersByNameOrEmail);

export default router;
