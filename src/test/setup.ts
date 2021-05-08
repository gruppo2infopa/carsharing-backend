import { DbConfig } from '../config/db.config';

beforeAll(async () => {
  await DbConfig.getInstance().sync();
});

beforeEach(async () => {
  await DbConfig.getInstance().drop();
  await DbConfig.getInstance().sync();
});

afterAll(async () => {
  await DbConfig.getInstance().drop();
  await DbConfig.getInstance().close();
});
