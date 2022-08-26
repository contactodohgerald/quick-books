import express from 'express'

const router = express.Router()

import VerificationController from '../app/controllers/Auth/VerificationController'

router.post('/verify', VerificationController.VerifyCode)

export default router