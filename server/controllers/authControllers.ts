import { RequestHandler, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import bcryptjs from 'bcryptjs';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { Users } from '../models/UsersModel';
import { config } from '../config/config';
import { Email } from '../utils/email';

async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(plainPassword, salt);
  return hashedPassword;
}

async function comparePasswords(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  return await bcryptjs.compare(plainTextPassword, hash);
}

function correctPasswords(
  password: string,
  passwordConfirm: string,
  res: Response
) {
  if (password.length < 8)
    return res.status(400).json({
      messsage: 'Password length must be greater than 8 char',
    });

  if (password !== passwordConfirm)
    return res.status(400).json({
      status: 'Error',
      messsage: 'Passwords are not the same!',
    });
}

function generateSendJWT(
  user: Users,
  statusCode: number,
  res: Response
): Response {
  const token = jwt.sign(user.toJSON(), config.jwt.secret);
  const cookieOptions = {
    expires: new Date(Date.now() + config.jwt.expires * 24 * 60 * 60 * 1000),
  };

  res.cookie('jwt', token, cookieOptions);

  return res.status(statusCode).json({
    status: 'success',
    token,
  });
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token: string;

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

    correctPasswords(password, passwordConfirm, res);

    // check that user doesnt exists
    const user = await Users.findOne({ where: { email } });

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

    // Send email
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();

    // all right send back token with body.
    generateSendJWT(newUser, 201, res);
  }
);

export const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !EmailValidator.validate(email) || !password)
      return res.status(400).json({
        status: 'Error',
        message: 'Please provide vaild credentails',
      });

    const user = await Users.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({
        status: 'Error',
        message: 'Cannot find this user in server',
      });

    const validPassowrds = await comparePasswords(password, user.password);

    if (!validPassowrds)
      return res.status(401).json({
        status: 'Error',
        message: 'Please provide valid password',
      });

    generateSendJWT(user, 200, res);
  }
);

export const forgetPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email || !EmailValidator.validate(email))
      return res.status(400).json({
        status: 'Error',
        message: 'Please provide vaild email',
      });

    const user = await Users.findOne({
      where: { email },
    });

    if (!user)
      return res.status(404).json({
        status: 'Error',
        message: "Sorry, this email doesn't exist",
      });

    // Create Token and add it on db
    const resetToken = crypto.randomBytes(3).toString('hex');

    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    new Email(user, resetUrl).sendResetPasswordDev(resetToken);

    res.status(200).json({
      status: 'Sucess',
      message: 'Your password reset token sent to your email.',
      user,
    });
  }
);

export const resetPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { resetToken } = req.params;
    const { password, passwordConfirm } = req.body;

    correctPasswords(password, passwordConfirm, res);

    const hasedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await Users.findOne({
      where: { passwordResetToken: hasedToken },
    });

    if (!user)
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });

    if (user.passwordResetExpires > new Date(Date.now() + 10 * 60 * 1000))
      return res.status(404).json({
        status: 'Error',
        message: 'Your password resest token is expired',
      });

    // update user info.

    console.log(new Date(Date.now()));
    user.password = await hashPassword(password);
    user.passwordConfirm = await hashPassword(passwordConfirm);
    user.passwordChangedAt = new Date(Date.now());
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    console.log(user.password);
    await user.save();

    generateSendJWT(user, 200, res);
  }
);
