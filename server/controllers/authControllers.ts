import { RequestHandler, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { Users } from '../models/UsersModel';
import { config } from '../config/config';
import { Email } from '../utils/email';
import { IGetUserAuthInfoRequest } from '../custom';
import {
  checkPasswords,
  comparePasswords,
  creatResetToken,
  generateSendJWT,
  hashPassword,
} from '../utils/authHelpers';

// To decode jwt.
interface UserPayload {
  id: string;
  iat: number;
}

export const protect = asyncHandler(
  async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
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

    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;
    const currentUser = await Users.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'passwordConfirm'] },
    });

    if (!currentUser) {
      return res.status(404).json({
        status: 'Error',
        message: 'Cannot find this user in server',
      });
    }
    /**
     * @todo:
     * If user change his password after,
     * let user login again
     */

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  }
);

export const signup: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password, passwordConfirm } = req.body;

    // validate the credentials
    if (!email || !EmailValidator.validate(email) || !password)
      return res.status(400).json({
        messsage: 'Error, please provide vaild credentials',
      });

    checkPasswords(password, passwordConfirm, res, next);

    // check that user doesnt exists
    const user = await Users.findOne({ where: { email } });

    if (user) {
      return res
        .status(422)
        .json({ status: 'Error', message: 'User may already exist' });
    }

    const newUser = await Users.create(req.body);

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

    const user = await Users.findOne({
      where: { email },
    });

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

export const logout: RequestHandler = (req: Request, res: Response) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  res.cookie('jwt', 'loggedout', cookieOptions);
  res.status(200).json({
    status: 'success',
    message: 'logged out',
  });
};

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

    user.passwordResetToken = creatResetToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    new Email(user, resetUrl).sendResetPasswordDev(resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Your password reset token sent to your email.',
    });
  }
);

export const resetPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { resetToken } = req.params;
    const { password, passwordConfirm } = req.body;

    checkPasswords(password, passwordConfirm, res, next);

    const hasedToken = creatResetToken(resetToken);
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
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordChangedAt = new Date(Date.now());
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    generateSendJWT(user, 200, res);
  }
);

export const updatePassword: RequestHandler = asyncHandler(
  async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    // Get user from req.user
    const user: Users = await Users.findByPk(req.user.id);

    // Check if current password equal password in db
    const validPassowrds = await comparePasswords(
      currentPassword,
      user.password
    );

    if (!validPassowrds)
      return res.status(401).json({
        status: 'Error',
        message: 'Your current password is wrong',
      });

    // Validate body.
    checkPasswords(newPassword, newPasswordConfirm, res, next);

    // Change user password
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Your password successfully changed',
    });
  }
);
