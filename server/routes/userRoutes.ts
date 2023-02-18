import { Router, Request, Response } from 'express';
import {
  signup,
  protect,
  login,
  forgetPassword,
  resetPassword,
  logout,
} from '../controllers/authControllers';
import {
  createUser,
  getAllUsers,
  deletAll,
} from '../controllers/usersControllers';

const router: Router = Router();

router.route('/').get(protect, getAllUsers).post(createUser).delete(deletAll);

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:resetToken', resetPassword);

export const userRoutes: Router = router;
