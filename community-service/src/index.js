if (process.env.NODE_ENV == 'test') {
  require('dotenv').load();
}
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';

import decodeAuthHeader from './helpers/decode-auth-header';

import * as secureHeader from './configs/helmet.config';
import route from './api/routes';

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
      reconnectInterval: 500,
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
  whitelist = [/[\S]\.?ohmpiromrak.local$/, 'http://localhost:4200'];
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

app.use(decodeAuthHeader.decode());
app.use('/communities', route.commuRoute);
app.use('/communities/inter-service', route.interRoute);

app.get('*', (req, res) => {
  res.send('COMMUNITY ENDPOINT');
});

export default app;
