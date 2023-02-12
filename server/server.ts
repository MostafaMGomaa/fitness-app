require('dotenv').config({ debug: true });

import { app } from './app';
import { config } from './config/config';

(async () => {
  const PORT = process.env.PORT || 3000;
  console.log(config.development);

  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
})();
