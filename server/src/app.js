const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const dataSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const userRoutes = require('./routes/userRoutes');
const sportRoutes = require('./routes/sportRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');

const app = express();

dotenv.config({ path: './config.env' });

// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
  })
);
app.use(dataSanitize());
app.use(xss());
app.use(hpp());

// Routes
// Test server
app.get('healthz', (req, res) => {
  res.status(200, {
    status: 'All right',
  });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/sports', sportRoutes);

// Error
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} in server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
