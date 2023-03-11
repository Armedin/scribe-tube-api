import express from 'express';
import { config } from 'dotenv';
import errorHandler from 'errorhandler';
import cookieParser from 'cookie-parser';

import TranscibeRoute from './routes/transcribe.route';
import { Routes } from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';

config();

const app = express();
const port = process.env.PORT;
const routes: Routes[] = [new TranscibeRoute()];

routes.forEach(route => app.use('/', route.router));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorMiddleware);

/**
 * Error Handler. Provides full stack
 */
// if (process.env.NODE_ENV === 'development') {
//   app.use(errorHandler());
// }

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
