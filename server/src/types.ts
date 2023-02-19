import { Request } from 'express';
import { Users } from './models/UsersModel';

export interface IGetUserAuthInfoRequest extends Request {
  user: Users;
}

// To decode jwt.
export interface UserPayload {
  id: string;
  iat: number;
}

export interface roomAttributes {
  id: string;
  title: string;
  cover?: string;
  owner_id?: Users;
  members_ids?: Users[];
  messages?: string[]; // After create messageModel it will be message[]
  createdAt?: Date;
  updatedAt?: Date;
}
