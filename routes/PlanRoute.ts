import express from 'express';
import passport from 'passport';

import PlanController from '../app/controllers/Plans/PlanController';

const router = express.Router();

router.get('/fetch-all', PlanController.getAllPlans);
router.get('/fetch/:planID', PlanController.fetchSinglePlan);
router.post('/create-plan', PlanController.createPlan);
router.delete('/delete/:planID', passport.authenticate('jwt', {session:false}), PlanController.deletePlan);

export default router;