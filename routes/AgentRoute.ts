import express from "express";
import passport from "passport";

import AgentController from '../app/controllers/Agents/AgentController';

const router = express.Router();

router.post('/create', passport.authenticate('jwt', {session:false}), AgentController.createAgents);
router.post('/login', AgentController.loginAgent);
router.get('/fetch', passport.authenticate('jwt', {session:false}), AgentController.fetchAllAgents);

export default router;