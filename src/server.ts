import express from 'express';
import { config } from 'dotenv';
import errorHandler from 'errorhandler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import serverless from 'serverless-http';

import TranscibeRoute from './routes/transcribe.route';
import { Routes } from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';

config();

const app = express();
const port = process.env.PORT;
const routes: Routes[] = [new TranscibeRoute()];

app.use(cors({ origin: '*', credentials: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorMiddleware);

if (process.env.NODE_ENV === 'development') {
  routes.forEach(route => app.use('/', route.router));
} else {
  routes.forEach(route => app.use('/.netlify/functions/server', route.router));
}

/**
 * Error Handler. Provides full stack
 */
// if (process.env.NODE_ENV === 'development') {
//   app.use(errorHandler());
// }

// app.get('/', (req, res) => {
//   res.send('ok');
// });

if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

exports.handler = serverless(app);
