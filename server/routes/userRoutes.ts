import { Router, Request, Response } from 'express';

import { createUser, getAllUsers } from '../controllers/usersControllers';

const router: Router = Router();

router.route('/').get(getAllUsers).post(createUser);

export const userRoutes: Router = router;
