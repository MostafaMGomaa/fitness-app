import express from 'express';
import morgan from 'morgan';

import { userRoutes } from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (req: express.Request, res: express.Response) => {
  res.send({
    status: 'success',
  });
});

app.use('/api/v1/users', userRoutes);

export { app };
