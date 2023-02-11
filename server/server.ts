require('dotenv').config({ debug: true });

import { app } from './app';
import { Sequelize } from 'sequelize-typescript';

(async () => {
  const PORT = process.env.PORT || 3000;
  const sequelize = new Sequelize({
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,

    dialect: 'postgres',
    storage: ':memory:',
  });
  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
})();
