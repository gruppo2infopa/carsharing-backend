import 'reflect-metadata';
import { createConnection } from 'typeorm';

async function main() {
  await createConnection();

  const { app } = require('./app'); // Conflitto con TypeORM
  app.listen(process.env.PORT, () => {
    if (!process.env.JWT_SECRET) {
      console.error('Specify a JWT secret');
      return;
    }
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main();
