import { app } from './app';
import { DbConfig } from './config/db.config';

async function main() {
  await DbConfig.getInstance().sync();

  app.listen(process.env.PORT, () => {
    if (!process.env.JWT_SECRET) {
      console.error('Specify a JWT secret');
      return;
    }
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main();
