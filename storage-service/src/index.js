import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import path from 'path';
import mkdirp from 'mkdirp';

import * as secureHeader from './configs/helmet.config';
import { router } from './api/routes';

const app = express();

const connectWithRetry = () => {
  mongoose
    .connect(
      process.env.MONGO_URI,
      {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        reconnectTries: 5,
        reconnectInterval: 500,
        poolSize: 10,
      }
    )
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
  whitelist = [/[\S]\.?ohmpiromrak.local$/, 'http://localhost:4200'];
}

const corsOptions = {
  origin: whitelist,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data'],
  credentials: true,
};

// app.use(cors(corsOptions));
app.use(cors());

app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mkdirp(path.join(__dirname, '../community'), err => {
  if (err) throw err;
  console.log('community folder created');
});

app.use(
  '/upload/community',
  express.static(path.join(__dirname, '../community')),
  router.communityRouter
);

app.use(
  '/upload/products',
  express.static(path.join(__dirname, '../products')),
  router.productRouter
);

app.get('*', (req, res) => {
  res.send('Storage ENDPOINT');
});

export default app;
