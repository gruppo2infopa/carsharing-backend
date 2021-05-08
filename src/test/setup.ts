import cookieParser from 'cookie-parser';
import { app } from '../app';
import { DbConfig } from '../config/db.config';

beforeAll(async () => {
  await DbConfig.getInstance().sync();
  app.use(cookieParser());
});

beforeEach(async () => {
  await DbConfig.getInstance().drop();
  await DbConfig.getInstance().sync();
});

afterAll(async () => {
  await DbConfig.getInstance().drop();
  await DbConfig.getInstance().close();
});
