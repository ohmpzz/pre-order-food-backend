import express from 'express';
import { AdminModel } from '../models/admin.model';
import jwt from 'express-jwt';

import { jwt as jwtConfig } from '../../middlewares/admin-service';
import { jwt as adminJwtConfig } from '../../middlewares/admin-auth';

import Validators from '../validates';

import Admin from '../services/admin.service';

export const router = express.Router();
export const authRouter = express.Router();

const AdminDB = new AdminModel();

router
  .route('/')
  .get(
    jwt({
      ...adminJwtConfig,
    }),
    (req, res) => {
      Admin.getAdminData(req, res);
    }
  )
  .delete((req, res) => {
    AdminDB.removeUser(req.body);
    res.json({});
  });

router
  .route('/log')
  .get((req, res) => {
    Admin.getLogs(req, res);
  })
  .delete((req, res) => {
    Admin.removeLog(req, res);
  });

router.post('/register', (req, res) => {
  Admin.register(req, res);
});

router.post('/login', Validators.adminLogin.check(), Admin.login);

router.post('/logout', (req, res) => {
  Admin.logout(req, res);
});

router.post('/verify', jwt({ ...adminJwtConfig }), (req, res) => {
  res.json({ success: true });
});

// internal
authRouter.use(jwt({ ...jwtConfig }));

authRouter.post('/verify', (req, res) => {
  Admin.verify(req, res);
});

authRouter.post('/find-user', (req, res) => {
  Admin.findUser(req, res);
});
