import express from 'express'

const router = express.Router()

import VerificationController from '../app/controllers/Auth/VerificationController'

router.post('/verify', VerificationController.verifyCode)
router.post('/resend/code/:userId', VerificationController.resendVerificationCode)

export default router