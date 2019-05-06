import express from 'express';
import proxy from 'http-proxy-middleware';
import morgan from 'morgan';
import auth from './middlewares/auth';
import cors from 'cors';
import helmet from 'helmet';

import * as secureHeader from './configs/helmet.conf';

const app = express();

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.contentSecurityPolicy(secureHeader.csp));
app.use(helmet.referrerPolicy(secureHeader.referrerPolicy));
app.use(helmet.featurePolicy(secureHeader.featurePolicy));

app.use(morgan('dev'));

let whitelist = [/[\S]\.?ohmpiromrak.com$/, /[\S]\.?ohmpiromrak.local$/];
if (process.env.NODE_ENV == 'development') {
  whitelist = [
    /[\S]\.?ohmpiromrak.local$/,
    'http://localhost:4200',
    'http://localhost:4000',
    /[\S]\.?ohmpiromrak.local:4200$/,
  ];
}

const corsOptions = {
  origin: whitelist,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data'],
  credentials: true,
};

app.use(cors(corsOptions));

const authRoute = proxy({
  target: process.env.PROXY_AUTH,
  changeOrigin: true,
});

const commuRoute = proxy({
  target: process.env.PROXY_COMMUNITY,
  changeOrigin: true,
});

const productRoute = proxy({
  target: process.env.PROXY_PRODUCT,
  changeOrigin: true,
});

const orderRoute = proxy({
  target: process.env.PROXY_ORDER,
  changeOrigin: true,
});

const uploadRoute = proxy({
  target: process.env.PROXY_STORAGE,
  changeOrigin: true,
});

// auth service routes
app.get('/auth/line', authRoute);
app.patch('/auth/line/phone', authRoute);
app.get('/auth/line/callback', authRoute);
app.post('/auth/line/logout', authRoute);
app.get('/auth/admin', authRoute);
app.delete('/auth/admin', authRoute);
app.get('/auth/admin/log', authRoute);
app.delete('/auth/admin/log', authRoute);
app.post('/auth/admin/register', authRoute);
app.post('/auth/admin/login', authRoute);
app.post('/auth/admin/logout', authRoute);
app.post('/auth/admin/verify', authRoute);
app.post('/auth/verify', authRoute);
app.get('/auth/user/find/:userId', authRoute);
app.get('/auth/search', authRoute);

// community service routes
app.get('/communities', commuRoute);
app.post('/communities', auth.allow(['admin']), commuRoute);
app.get('/communities/owner', auth.allow(), commuRoute);
app.post('/communities/owner/groupId', commuRoute);
app.get('/communities/:id', commuRoute);
app.put('/communities/:id', auth.allow(['admin']), commuRoute);
app.delete('/communities/:id', auth.allow(['admin']), commuRoute);
app.post(
  '/communities/:groupId/members',
  auth.allow(['user', 'admin']),
  commuRoute
);
app.put(
  '/communities/:groupId/members',
  auth.allow(['user', 'admin']),
  commuRoute
);

// product service routes
app.get('/products', productRoute);
app.post('/products', productRoute);
app.get('/products/owner/:ownerId', auth.allow(), productRoute);
app.patch('/products/:productId', auth.allow(), productRoute);
app.put('/products/:productId', auth.allow(), productRoute);
app.delete('/products/:productId', auth.allow(), productRoute);

app.get('/products/:groupId', productRoute);
app.post('/products/:groupId', auth.allow(), productRoute);

app.get('/preorders', productRoute);
app.get('/preorders/all', productRoute);
app.get('/preorders/my-group', auth.allow(), productRoute);
app.post('/preorders', productRoute);
app.get('/preorders/owner', productRoute);
app.get('/preorders/:preorderId', productRoute);
app.delete('/preorders/owner/:preorderId', productRoute);

// order service routes
app.get('/orders', orderRoute);
app.get('/orders/owner', auth.allow(), orderRoute);
app.post('/orders', orderRoute);
app.patch('/orders/owner/:orderId', auth.allow(), orderRoute); // cancel order
app.patch('/orders/:orderId', auth.allow(), orderRoute); // update status
app.delete('/orders/preorder/:preorderId', orderRoute);

/////////////////////
app.get('/orders/products/:productId', orderRoute);
app.get('/orders/owners/:ownerId', auth.allow(), orderRoute);
app.get('/orders/users/:userId', auth.allow(), orderRoute);
app.put('/orders/:orderId', auth.allow(), orderRoute);
app.delete('/orders/:orderId', auth.allow(), orderRoute);

// upload service routes
app.get('/upload/community', uploadRoute);
app.post('/upload/community/cover', uploadRoute);
app.delete('/upload/community/cover', uploadRoute);
app.get('/upload/community/cover/:id', uploadRoute);
app.get('/upload/products', uploadRoute);
app.post('/upload/products', uploadRoute);
app.delete('/upload/products', uploadRoute);
app.get('/upload/products/:id', uploadRoute);

// app.use(
//   '/auth',
//   proxy({
//     target: process.env.PROXY_AUTH,
//     changeOrigin: true,
//   })
// );

// app.use(
//   '/community',
//   proxy({
//     target: process.env.PROXY_COMMUNITY,
//     changeOrigin: true,
//   })
// );

// app.use(
//   '/products',
//   proxy({
//     target: process.env.PROXY_PRODUCT,
//     changeOrigin: true,
//   })
// );

// app.use(
//   '/orders',
//   proxy({
//     target: process.env.PROXY_ORDER,
//     changeOrigin: true,
//   })
// );

// app.use(
//   '/upload',
//   proxy({
//     target: process.env.PROXY_STORAGE,
//     changeOrigin: true,
//   })
// );

app.get('*', (req, res) => {
  return res.sendStatus(404).end();
});

export default app;
