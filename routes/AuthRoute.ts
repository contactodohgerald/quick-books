import express from 'express';

const router = express.Router();

import RegisterController from '../app/controllers/Auth/RegisterController';
import LoginController from '../app/controllers/Auth/LoginController';


router.post('/register', RegisterController.registerRequest)
router.post('/login', LoginController.loginRequest)

export default router;