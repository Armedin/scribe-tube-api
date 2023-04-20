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
const router = express.Router();
const routes: Routes[] = [new TranscibeRoute()];

app.use(cors({ origin: '*', credentials: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorMiddleware);

routes.forEach(route => app.use('/', route.router));

router.use('/', router);

/**
 * Error Handler. Provides full stack
 */
// if (process.env.NODE_ENV === 'development') {
//   app.use(errorHandler());
// }

// app.get('/', (req, res) => {
//   res.send('ok');
// });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

exports.handler = serverless(app);
