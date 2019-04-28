import * as LINE from './line.route';
import * as JWT from './jwt.route';
import * as ADMIN from './admin.route';
import searchRouter from './search.route';
import findRouter from './find.route';
import interServiceRouter from './inter-service.route';

export const router = {
  lineRouter: LINE.router,
  jwtRouter: JWT.router,
  adminRouter: ADMIN.router,
  microserviceAdminRouter: ADMIN.authRouter,
  searchRouter,
  findRouter,
  interServiceRouter,
};
