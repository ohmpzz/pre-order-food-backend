import express from 'express';
import passport from 'passport';

import userCredentialService from '../services/user-credential.service';
import validators from '../validates';

const router = express.Router();

router
  .route('/credentials')
  /**
   * Fetch user credental by user id
   * @req.body.users userId: Array
   *
   * middleware: Check Auth
   */
  .post(
    validators.userCredential.check(),
    userCredentialService.getUsersCredential
  );

export default router;
