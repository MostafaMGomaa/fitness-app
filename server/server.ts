require('dotenv').config({ debug: true });

import { app } from './app';
import { config } from './config/config';
import connection from './sequelize';

const PORT = process.env.PORT || 3000;

console.log(config.production.sendGridEmail); // remove this after you've confirmed it is working

(async () => {
  try {
    await connection.sync().then(() => console.log('DB sync succesfull'));
  } catch (err) {
    console.log('There was an error!', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
