import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import passport from './middlewares/passport';
import session from 'express-session';

import { router } from './api/routes';

import * as secureHeader from './configs/helmet.config';

const app = express();

const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      reconnectTries: 5,
      reconnectInterval: 1000,
      poolSize: 10,
    })
    .then(() => {
      console.log('MongoDB is connected');
    })
    .catch(err => {
      console.log('Mongo could not connect');
      console.log('retry after 5 seconds.');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Security Header
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'Ohm Piromrak' }));
app.use(helmet.contentSecurityPolicy(secureHeader.csp));
app.use(helmet.referrerPolicy(secureHeader.referrerPolicy));
app.use(helmet.featurePolicy(secureHeader.featurePolicy));

let whitelist = [/[\S]\.?ohmpiromrak.com$/, /[\S]\.?ohmpiromrak.local$/];

if (process.env.NODE_ENV == 'development') {
  whitelist = [
    /[\S]\.?ohmpiromrak.local$/,
    'http://localhost:4200',
    /[\S]\.?ohmpiromrak.local:4200$/,
  ];
}

const corsOptions = {
  origin: whitelist,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let sess = {
  secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV == 'production') {
  app.set('trust proxy', 1);
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth/verify', router.jwtRouter);
app.use('/auth/line', router.lineRouter);
app.use('/auth/admin', router.adminRouter);
app.use('/auth/user/find', router.findRouter);
app.use('/auth/search', router.searchRouter);

// internal api
app.use('/auth/inter-service/admin', router.microserviceAdminRouter);
app.use('/auth/inter-service/users', router.interServiceRouter);

app.get('*', (req, res) => {
  res.send('ENDPOINT');
});

export default app;
