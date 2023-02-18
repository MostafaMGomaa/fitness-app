import { NextFunction, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { Users } from '../models/UsersModel';
import { config } from '../config/config';

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(plainPassword, salt);
  return hashedPassword;
}

export async function comparePasswords(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  return await bcryptjs.compare(plainTextPassword, hash);
}

export function checkPasswords(
  password: string,
  passwordConfirm: string,
  res: Response,
  next: NextFunction
) {
  if (password.length < 8)
    return res.status(400).json({
      messsage: 'Password length must be greater than 8 char',
    });

  if (password !== passwordConfirm) {
    res.status(400).json({
      status: 'Error',
      messsage: 'Passwords are not the same!',
    });
    next();
  }
}

export function generateSendJWT(
  user: Users,
  statusCode: number,
  res: Response
): Response {
  user.password = null;
  user.passwordConfirm = null;

  const token = jwt.sign(user.toJSON(), config.jwt.secret);
  const cookieOptions = {
    expires: new Date(Date.now() + config.jwt.expires * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  return res.status(statusCode).json({
    status: 'success',
    token,
  });
}

export function creatResetToken(resetToken: string) {
  return crypto.createHash('sha256').update(resetToken).digest('hex');
}

export function changePasswordAfter(
  JWTTimeStamp: number,
  user: Users
): boolean {
  if (user.passwordChangedAt != null) {
    const chagedPasswordTimestamp = Math.floor(
      user.passwordChangedAt.getTime() / 1000
    );
    return chagedPasswordTimestamp > JWTTimeStamp;
  }
  return false;
}
