import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { userRoutes } from './routes/userRoutes';
import { roomRoutes } from './routes/roomRoutes';

const app = express();

const errHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Hi, Uncaught exception', err);
  return res.status(500).json({
    err: 'Un expected error occurred, please try agian later',
    msg: err,
  });
};

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (req: Request, res: Response) => {
  res.send({
    status: 'success',
  });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);

app.use(errHandler);

export { app };
