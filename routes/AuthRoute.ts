import express from 'express';

const router = express.Router();

import RegisterController from '../app/controllers/Auth/RegisterController';

router.post('/register', RegisterController)

export default router;