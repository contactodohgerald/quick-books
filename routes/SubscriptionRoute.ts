import express from 'express'

import SubscriptioController from '../app/controllers/Subscription/SubscriptioController';

const router = express.Router();

router.post('/create', SubscriptioController.createSubscription);
router.post('/verify', SubscriptioController.verifySubscription);
router.get('/fetch', SubscriptioController.fetchAllSubcriptions);

export default router