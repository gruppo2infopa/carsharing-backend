import { createConnection } from 'typeorm';
import { app } from './app';

async function main() {
  app.listen(process.env.PORT, () => {
    if (!process.env.JWT_SECRET) {
      console.error('Specify a JWT secret');
      return;
    }
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main();
