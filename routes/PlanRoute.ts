import express from 'express';

import PlanController from '../app/controllers/Plans/PlanController';

const router = express.Router();

router.get('/fetch-all', PlanController.getAllPlans);
router.post('/create-plan', PlanController.createPlan);

export default router;