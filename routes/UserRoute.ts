import express from 'express';
import passport from 'passport';

const router = express.Router();

import UserController from '../app/controllers/Users/UserController';

router.get('/fetch/all/:type', passport.authenticate('jwt', {session : false}), UserController.fetchAllUser)
router.post('/update/password/:userID', passport.authenticate('jwt', {session : false}), UserController.updateUserPassword)

export default router;