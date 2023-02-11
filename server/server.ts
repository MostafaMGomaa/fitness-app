require('dotenv').config({ debug: true });

import express from 'express';
import { app } from './app';

(async () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on PORT :${PORT}`);
  });
})();
