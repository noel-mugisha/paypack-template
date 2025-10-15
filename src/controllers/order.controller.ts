import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import {
  createOrderSchema,
  payForOrderSchema,
  webhookPayloadSchema,
} from '../validation/order.schema';

const orderService = new OrderService();

export class OrderController {

  public async createOrder(req: Request, res: Response) {
    try {
      const { body } = createOrderSchema.parse(req);

      const order = await orderService.createOrder(body);

      res.status(201).json({
        message: 'Order created successfully.',
        order,
      });
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating order', error: error.message });
    }
  }

  public async payForOrder(req: Request, res: Response) {
    try {
      const { params } = payForOrderSchema.parse(req);

      const result = await orderService.processOrderPayment(params.orderId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: 'Error processing payment', error: error.message });
    }
  }


  public async handlePaypackWebhook(req: Request, res: Response) {
    try {
      const { body } = webhookPayloadSchema.parse(req);

      console.log(`Received webhook event: ${body.event_kind}`);

      await orderService.handleWebhookUpdate(body.data);

      // IMPORTANT: Respond to Paypack with a 200 OK to acknowledge receipt.
      // If you don't, Paypack will consider the webhook failed and will retry.
      res.status(200).send('Webhook received.');
    } catch (error: any) {
      console.error('Webhook processing error:', error.message);
      res.status(400).json({ message: 'Error processing webhook', error: error.message });
    }
  }
}