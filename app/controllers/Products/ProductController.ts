import { Request, Response } from 'express'
import Validator from 'validatorjs'
import { uploadImage } from '../../../library/cloudinary';
import { createUniqueId } from '../../../traits/Generics';
import { ReturnRequest } from '../../../traits/Request';
import { returnMessage } from '../../../traits/SystemMessage';

declare module 'express' {
    interface Request {
        user?: any;
    }
}

import Product from '../../models/Products/ProductModel'

class ProductController {

    async createProduct(req: Request, res: Response) {
        const body: Record<string, any> = req.body;
        let validation = new Validator(body, {
            title: "required",
            unit_price: "required",
            quantity: "required",
        })
        if (validation.fails())
            ReturnRequest(res, 400, validation.errors, {})

        const {title, unit_price, quantity, thumbnail, description} = body;
        const _thumbnail = await uploadImage(thumbnail);
        const products = new Product({
            uniqueId: createUniqueId(),
            userID: req.user.uniqueId,
            title: title,
            unit_price: unit_price,
            qty: quantity,
            thumbnail: _thumbnail,
            desc: description,
        })
        try {
            await products.save();
            ReturnRequest(res, 200, returnMessage("created"), products) 
        } catch (err: any) {
            ReturnRequest(res, 500, err, {})
        }       
    }

    async fetchProducts(req: Request, res: Response) {
        try {
            const prodcuts = await Product.find({ deletedAt: null });
            if(prodcuts.length === 0){
                ReturnRequest(res, 400, returnMessage("returned_error"), {});
            }
            ReturnRequest(res, 200, returnMessage("returned_success"), prodcuts);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }

    async fetchProductsByUser(req: Request, res: Response) {
        try {
            const prodcuts = await Product.find({ userID: req.user.uniqueId, deletedAt: null });
            if(prodcuts.length === 0){
                ReturnRequest(res, 400, returnMessage("returned_error"), {});
            }
            ReturnRequest(res, 200, returnMessage("returned_success"), prodcuts);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }

    async fetchSingleProduct(req: Request, res: Response) {
        const productID = req.params.productID;
        try {
            const product = await Product.findOne({ uniqueId: productID });
            if(product){
                ReturnRequest(res, 200, returnMessage("returned_success"), product);   
            }else{
                ReturnRequest(res, 400, returnMessage("returned_error"), {});
            }
        } catch (err: any) {
            ReturnRequest(res, 500, err, {})
        }
    }
}

export default new ProductController