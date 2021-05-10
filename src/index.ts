import 'reflect-metadata';
import { createConnection } from 'typeorm';

async function main() {
  const connection = await createConnection();

  // Conflitto con TypeORM
  const { app } = require('./app');
  app.listen(process.env.PORT, () => {
    if (!process.env.JWT_SECRET) {
      console.error('Specify a JWT secret');
      return;
    }
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main();
