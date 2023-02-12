import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';

import morgan from 'morgan';

import { userRoutes } from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (req: Request, res: Response) => {
  res.send({
    status: 'success',
  });
});

app.use('/api/v1/users', userRoutes);

const errHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Hi, Uncaught exception', err);
  return res
    .status(500)
    .send('Un expected error occurred, please try agian later');
};

export { app };
