import { createConnection, getConnection } from 'typeorm';

(async function () {
  try {
    await createConnection('test');
  } catch (error) {
    console.log(error);
  }
})();
/*beforeEach(async () => {
  await createConnection('test');
});

afterEach(async () => {
  await getConnection('test').close();
});*/
