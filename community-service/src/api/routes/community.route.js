import express from 'express';
import fromCommuService from '../services/community.service';
import validators from '../validates';

import MemberOfGroup from '../../middlewares/manage-user';

export const router = express.Router();
export const interRouter = express.Router();

router
  .route('/')
  .get(fromCommuService.getAllCommunities)
  .post(fromCommuService.createCommunity);

router
  .route('/:id')
  .get(fromCommuService.getCommunityById)
  .put(validators.community.check(), fromCommuService.updateCommunity)
  .delete(fromCommuService.removeCommunity);

router
  .route(
    '/:groupId/members',
    MemberOfGroup.validate,
    validators.addUser.check()
  )
  .post(fromCommuService.addMember)
  .put(fromCommuService.removeMember);

export default router;
