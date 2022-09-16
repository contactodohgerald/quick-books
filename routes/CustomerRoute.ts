import express from 'express'
import passport from 'passport';

import CustomerController from '../app/controllers/Custormer/CustomerController';

const router = express.Router();

router.post('/create', passport.authenticate('jwt', {session: false}), CustomerController.createCustormer);
router.get('/fetch', passport.authenticate('jwt', {session: false}), CustomerController.fetchAllCustormer);

export default router;