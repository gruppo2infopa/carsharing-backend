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

    if (!process.env.NOREPLY_EMAIL) {
      console.error('Specify an email to send verification links');
      return;
    }

    if (!process.env.NOREPLY_PASSWORD) {
      console.error(
        'Specify a password for the gmail account to send verification links'
      );
      return;
    }

    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main();
