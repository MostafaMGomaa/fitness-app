import { RequestHandler, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import bcryptjs from 'bcryptjs';
import * as EmailValidator from 'email-validator';

import { Users } from '../models/UsersModel';

export const getAllUsers: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users: Users[] = await Users.findAll({
      attributes: {
        exclude: ['password', 'passwordConfirm'],
      },
    });
    res.status(200).json({
      message: 'success',
      data: { length: users.length, users },
    });
  }
);

export const createUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await Users.create({ ...req.body });
    res.status(200).json({
      message: 'success',
      data: { newUser },
    });
  }
);

// For dev only
export const deletAll: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const newUser = await Users.destroy({
      where: {},
      truncate: true,
    });
    return res.status(200).json(null);
  }
);
