import { Sequelize } from 'sequelize-typescript';
import { Users } from './models/UsersModel';
import { config } from './config/config';
import { Room } from './models/roomModel';

const connection = new Sequelize({
  dialect: 'mysql',
  host: config.development.host,
  username: config.development.username,
  password: config.development.password,
  database: config.development.database,
  logging: false,
  models: [Users, Room],
  storage: ':memory:',
});

export default connection;
