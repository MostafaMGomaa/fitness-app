import { Request } from 'express';
import { Users } from './models/UsersModel';

export interface IGetUserAuthInfoRequest extends Request {
  user: Users;
}
