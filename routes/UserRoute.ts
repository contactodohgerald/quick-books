import express from 'express';

const router = express.Router();

import UserController from '../app/controllers/Users/UserController';

router.get('/fetch/all/:type', UserController.fetchAllUser)

export default router;