import express from 'express'
import passport from 'passport'

import ProductController from '../app/controllers/Products/ProductController'

const router = express.Router()

router.post('/create', passport.authenticate('jwt', {session:false}), ProductController.createProduct);
router.get('/fetch/all', passport.authenticate('jwt', {session:false}), ProductController.fetchProducts);
router.get('/fetch', passport.authenticate('jwt', {session:false}), ProductController.fetchProductsByUser);
router.get('/fetch/:productID', passport.authenticate('jwt', {session:false}), ProductController.fetchProductsByUser);

export default router;