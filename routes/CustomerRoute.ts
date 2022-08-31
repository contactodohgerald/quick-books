import express from 'express'
import passport from 'passport';

import CustomerController from '../app/controllers/Custormer/CustomerController';

const router = express.Router();

router.post('/create', passport.authenticate('jwt', {session: false}), CustomerController.createCustormer);

export default router;