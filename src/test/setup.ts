import { createConnection } from 'typeorm';

(async function () {
  try {
    await createConnection('test');
  } catch (error) {
    console.log(error);
  }
})();
