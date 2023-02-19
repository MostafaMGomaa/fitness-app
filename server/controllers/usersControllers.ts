import { RequestHandler, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import { IGetUserAuthInfoRequest } from '../custom';
import { Users } from '../models/UsersModel';

export const getAllUsers: RequestHandler = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
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

export const createUser: RequestHandler = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint no longer exists try /api/v1/signup',
  });
};

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
