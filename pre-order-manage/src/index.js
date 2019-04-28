import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import * as secureHeader from './configs/helmet.config';

const app = express();

// Security Header
// app.use(helmet());
// app.use(helmet.hidePoweredBy({ setTo: 'Ohm Piromrak' }));
// app.use(helmet.contentSecurityPolicy(secureHeader.csp));
// app.use(helmet.referrerPolicy(secureHeader.referrerPolicy));
// app.use(helmet.featurePolicy(secureHeader.featurePolicy));

app.use(morgan('dev'));
app.use(compression());

let whitelist = [/[\S]\.?ohmpiromrak.com$/, /[\S]\.?ohmpiromrak.local$/];

const corsOptions = {
  origin: whitelist,
  methods: ['GET'],
  allowedHeaders: [],
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
