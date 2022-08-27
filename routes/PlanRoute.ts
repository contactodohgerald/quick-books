import express from 'express';
import passport from 'passport';

import PlanController from '../app/controllers/Plans/PlanController';

const router = express.Router();

router.get('/fetch-all', PlanController.getAllPlans);
router.post('/create-plan', passport.authenticate('jwt', { session: false}), PlanController.createPlan);

export default router;