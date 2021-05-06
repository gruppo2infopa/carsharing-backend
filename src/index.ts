import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthRouter } from './controllers/auth.controller';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.handler';

const app = express();

dotenv.config();

app.use(json());
app.use(cors());
app.use(cookieParser(undefined, {}));

// Routers
app.use('/auth', AuthRouter);

// Middlewares
app.use(errorHandler);

const env = process.env;

app.listen(env.PORT, () => {
  if (!env.JWT_SECRET) {
    console.error('Specify a JWT secret');
    return;
  }
  console.log(`Listening on port ${env.PORT}`);
});
