import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { paypackService } from '../services/paypack.service'; 
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
    const signature = req.get('x-paypack-signature');
    const rawBody = (req as any).rawBody;

    if (!paypackService.verifyWebhookSignature(signature, rawBody)) {
      console.warn('Invalid webhook signature received. Rejecting request.');
      return res.status(401).send('Invalid signature.');
    }

    console.log('Webhook signature verified successfully.');

    try {
      const { body } = webhookPayloadSchema.parse(req);

      console.log(`Received webhook event: ${body.kind}`);

      await orderService.handleWebhookUpdate(body.data);

      res.status(200).send('Webhook received and processed.');
    } catch (error: any) {
      console.error('Webhook processing error after validation:', error.message);
      res.status(400).json({ message: 'Error processing webhook', error: error.message });
    }
  }
}