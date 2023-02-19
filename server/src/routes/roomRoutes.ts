import { Router, Request, Response } from 'express';
import { Room } from '../models/roomModel';
import { Users } from '../models/UsersModel';

const router: Router = Router();

router
  .route('/')
  .get(async (req, res) => {
    const rooms = await Room.findAll({ include: Users });
    res.send(rooms);
  })
  .post(async (req, res) => {
    const room = await Room.create(req.body);
    res.send(room);
  });

export const roomRoutes: Router = router;
