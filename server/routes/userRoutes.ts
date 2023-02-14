import { Router, Request, Response } from 'express';
import { signup, protect, login } from '../controllers/authControllers';
import {
  createUser,
  getAllUsers,
  deletAll,
} from '../controllers/usersControllers';

const router: Router = Router();

router.route('/').get(protect, getAllUsers).post(createUser).delete(deletAll);

router.post('/signup', signup);
router.post('/login', login);

export const userRoutes: Router = router;
