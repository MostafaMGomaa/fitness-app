export const config = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    mailTrapEmail: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      username: process.env.EMAIL_USERNAME as string,
      password: process.env.EMAIL_PASSWORD as string,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expires: 90,
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    sendGridEmail: {
      username: process.env.SENDGRID_USERNAME as string,
      password: process.env.SENDGRID_PASSWORD as string,
    },
  },
};
