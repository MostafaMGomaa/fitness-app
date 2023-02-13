require('dotenv').config({ debug: true });

import { app } from './app';
import { config } from './config/config';
import connection from './sequelize';

const PORT = process.env.PORT || 3000;

console.log(config.development);

connection.sync().then(() => console.log('DB sync succesfull'));

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
