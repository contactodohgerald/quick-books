import { Request, Response } from 'express';
import Validator from 'validatorjs';
import { ReturnRequest } from '../../../traits/Request';
import { returnMessage } from '../../../traits/SystemMessage';
import Product from '../../models/Products/ProductModel';
import Sales from '../../models/Sales/SalesModel';


class SalesController {
    async createOrder(req: Request, res: Response) {
        const body: Record<string, any> = req.body;
        let validation = new Validator(body, {
            'agentID': 'required',
            'custormerID': 'required',
            'payment_method': 'required',
            'payment_mode': 'required',
            'product': 'required|array',
        })
        if(validation.fails())
            ReturnRequest(res, 404, validation.errors, {});

        const { agentID, custormerID, payment_method, payment_mode, desc, product, discount } = body;
        const sales = new Sales({agentID, custormerID, product, payment_method, payment_mode, desc, discount })
        try {
            //work on the product
            product.forEach(async (rst: any) => {
                const products = await Product.findOne({ _id: rst.productID });
                if(products){
                    const err = 'the quantity of '+products.title+' is below the quantity inputed' ;
                    if(rst.qty > products.qty)
                        ReturnRequest(res, 500, err, {});
                     
                    const newQty = products.qty - rst.qty;
                    products.updateOne({qty: newQty}, (err: any) => {
                        if(err)
                            ReturnRequest(res, 404, err, {});
                    });
                }else{
                    ReturnRequest(res, 404, returnMessage('returned_error'), {});
                }
            });
            await sales.save()
                .then((result: any) => ReturnRequest(res, 201, returnMessage('created'), result))
                .catch(err => ReturnRequest(res, 404, err.message, {}));
        }catch (err: any) { ReturnRequest(res, 500, err.message, {}); }

    }

    async fetchAllSales(req: Request, res: Response) {
        try {
            const sales = await Sales.find({ deletedAt: null });
            if(sales.length === 0)
                ReturnRequest(res, 404, returnMessage("returned_error"), {});

            ReturnRequest(res, 201, returnMessage("returned_success"), sales);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }

    async fetchSingleSale(req: Request, res: Response) {
        try {
            const salesID = req.params.salesID;
            const sales = await Sales.findOne({ _id: salesID });
            if(sales){
                ReturnRequest(res, 201, returnMessage("returned_success"), sales);
            }else{
                ReturnRequest(res, 404, returnMessage("returned_error"), {});
            }
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }
}

export default new SalesController;

