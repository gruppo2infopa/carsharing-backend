import { createConnection } from 'typeorm';

(async () => {
  console.log(__dirname);

  const connection = await createConnection({
    type: 'sqlite',
    database: 'db/dbfile.db',
    entities: [__dirname + '../models/**/*.js'],
    logging: true,
  });
  // console.log('[hello]', connection);

  // await connection.connect();
})();
