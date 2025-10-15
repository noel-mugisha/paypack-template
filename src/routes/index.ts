import { Router } from 'express';
import orderRouter from './order.routes';
import { OrderController } from '../controllers/order.controller';

const mainRouter = Router();

mainRouter.use('/orders', orderRouter);

mainRouter.post('/webhooks/paypack', (req, res) =>
  new OrderController().handlePaypackWebhook(req, res)
);

// Export the main router.
export default mainRouter;