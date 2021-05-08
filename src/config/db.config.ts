import { Sequelize } from 'sequelize';

class DbConfig {
  static instance: Sequelize | undefined;

  static getInstance(): Sequelize {
    if (this.instance === undefined) {
      if (process.env.NODE_ENV === 'test') {
        this.instance = new Sequelize('sqlite::memory:', { logging: false });
      } else {
        this.instance = new Sequelize({
          dialect: 'sqlite',
          storage: 'db/dbfile.db',
        });
      }
    }
    return this.instance!;
  }
}

export { DbConfig };
