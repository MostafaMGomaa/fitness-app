import { RequestHandler, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import bcryptjs from 'bcryptjs';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';

import { Users } from '../models/UsersModel';
import { config } from '../config/config';

async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(plainPassword, salt);
  return hashedPassword;
}

async function comparePasswords(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password
  return await bcryptjs.compare(plainTextPassword, hash);
}

function generateJWT(user: Users, res: Response): string {
  const token = jwt.sign(user.toJSON(), config.jwt.secret);
  const cookieOptions = {
    expires: new Date(Date.now() + config.jwt.expires * 24 * 60 * 60 * 1000),
  };
  res.cookie('jwt', token, cookieOptions);
  return token;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token)
      return res.status(401).json({
        status: 'Error',
        message: 'You are not logged in! Please login for get access',
      });

    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
  }
);

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

    // check that user doesnt exists
    const user = await Users.findByPk(email);

    if (user) {
      return res
        .status(422)
        .json({ status: 'Error', message: 'User may already exist' });
    }

    // hash the password in db
    const hashedPassword = await hashPassword(password);
    req.body.password = req.body.passwordConfirm = hashedPassword;

    // create User
    const newUser = await Users.create({ ...req.body });

    // all right send back token with body.
    const token = generateJWT(newUser, res);
    return res.status(200).send({
      status: 'success',
      message: 'User signed up succesfully',
      token,
    });
  }
);

export const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !EmailValidator.validate(email))
      return res.status(400).json({
        status: 'Error',
        message: 'Please provide vaild email',
      });

    if (!password)
      return res.status(400).json({
        status: 'Error',
        message: 'Please provide vaild password',
      });

    const user = await Users.findByPk(email);

    if (!user)
      return res.status(401).json({
        status: 'Error',
        message: 'Cannot find this user in server',
      });

    const validPassowrds = await comparePasswords(password, user.password);

    if (!validPassowrds)
      return res.status(401).json({
        status: 'Error',
        message: 'Please provide valid password',
      });

    const token = generateJWT(user, res);

    res.status(200).json({
      status: 'sucess',
      message: 'user signned in sucessfully',
      token,
    });
  }
);
