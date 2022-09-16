import express from 'express';
import passport from 'passport';
import SalesController from '../app/controllers/Sales/SalesController';

const router = express.Router();


router.post('/create', passport.authenticate('jwt', { session: false }), SalesController.createOrder);
router.get('/fetch', passport.authenticate('jwt', { session: false }), SalesController.fetchAllSales);
router.get('/fetch/:salesID', passport.authenticate('jwt', { session: false }), SalesController.fetchSingleSale);


export default router;