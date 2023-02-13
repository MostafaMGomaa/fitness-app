import { RequestHandler, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import { Users } from '../models/UsersModel';

export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users: Users[] = await Users.findAll();
  res.status(200).json({
    message: 'success',
    data: { users },
  });
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newUser = await Users.create({ ...req.body });
  res.status(200).json({
    message: 'success',
    data: { newUser },
  });
};
