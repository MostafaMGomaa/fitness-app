import { RequestHandler, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import bcryptjs from 'bcryptjs';
import * as EmailValidator from 'email-validator';

import { Users } from '../models/UsersModel';

async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(plainPassword, salt);
  return hashedPassword;
}

export const signup: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password, passwordConfirm } = req.body;

    // validate the credentials
    if (!email || !EmailValidator.validate(email) || !password)
      return res.status(400).json({
        messsage: 'Error, please provide vaild credentials',
      });

    if (password !== passwordConfirm)
      return res.status(400).json({
        messsage: 'Error, Passwords are not the same!',
      });

    // hash the password
    const hashedPassword = await hashPassword(password);

    req.body.password = req.body.passwordConfirm = hashedPassword;
    // create User
    const newUser = await Users.create({ ...req.body });

    // all right send back newUser without password and passwordConfirm
    return res.status(200).send({
      status: 'success',
      message: 'User signed up succesfully',
    });
  }
);
