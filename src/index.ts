import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(json());
app.use(cors());

const env = process.env;

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
