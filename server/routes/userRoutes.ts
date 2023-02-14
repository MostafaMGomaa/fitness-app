import { Router, Request, Response } from 'express';
import { signup } from '../controllers/authControllers';
import {
  createUser,
  getAllUsers,
  deletAll,
} from '../controllers/usersControllers';

const router: Router = Router();

router.route('/').get(getAllUsers).post(createUser).delete(deletAll);

router.post('/signup', signup);

export const userRoutes: Router = router;
