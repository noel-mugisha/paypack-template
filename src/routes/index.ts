import { Router } from 'express';
import orderRouter from './order.routes';
import { OrderController } from '../controllers/order.controller';

const mainRouter = Router();

mainRouter.use('/orders', orderRouter);

mainRouter
  .route('/webhooks/paypack')
  .head((req, res) => {
    res.status(200).send('Webhook endpoint is valid.');
  })
  .post((req, res) => new OrderController().handlePaypackWebhook(req, res));

export default mainRouter;