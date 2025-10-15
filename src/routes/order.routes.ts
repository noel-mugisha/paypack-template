import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post('/', (req, res) => orderController.createOrder(req, res));

orderRouter.post('/:orderId/pay', (req, res) => orderController.payForOrder(req, res));

export default orderRouter;