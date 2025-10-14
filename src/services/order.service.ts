import { PrismaClient, OrderStatus } from '@prisma/client';
import { paypackService } from './paypack.service'; 


const prisma = new PrismaClient();

export class OrderService {
  /**
   * @method createOrder
   * @description Creates a new order in the database with a PENDING status.
   * @param {object} data - The order data.
   * @param {number} data.amount - The order amount.
   * @param {string} data.customerPhone - The customer's phone number.
   * @returns {Promise<Order>} The newly created order object.
   */
  public async createOrder(data: { amount: number; customerPhone: string }) {
    const order = await prisma.order.create({
      data: {
        amount: data.amount,
        customerPhone: data.customerPhone,
        status: OrderStatus.PENDING, // The initial status is always PENDING
      },
    });
    return order;
  }

  /**
   * @method processOrderPayment
   * @description Initiates payment for an existing order.
   * @param {string} orderId - The ID of the order to be paid.
   * @returns {Promise<{ message: string, order: Order }>} A confirmation message and the updated order.
   */
  public async processOrderPayment(orderId: string) {
    // Step 1: Find the order in our database.
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    // Handle case where the order doesn't exist.
    if (!order) {
      throw new Error('Order not found.');
    }

    // Security Check: Prevent re-payment of an already processed or completed order.
    if (order.status !== OrderStatus.PENDING) {
      throw new Error(`Order cannot be paid. Current status: ${order.status}`);
    }

    // Step 2: Call our centralized PaypackService to initiate the payment.
    const paypackRef = await paypackService.initiateCashin({
      amount: order.amount,
      phoneNumber: order.customerPhone,
    });

    // Step 3: Update our order with the Paypack reference and set status to PROCESSING.
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paypackRef: paypackRef, // Link our order to the Paypack transaction
        status: OrderStatus.PROCESSING, // The payment is now in progress
      },
    });

    return {
      message: 'Payment initiated. Please check your phone to approve.',
      order: updatedOrder,
    };
  }

  /**
   * @method handleWebhookUpdate
   * @description Processes a webhook event from Paypack and updates the order status.
   * @param {object} webhookData - The data received from the Paypack webhook.
   * @param {string} webhookData.ref - The transaction reference.
   * @param {string} webhookData.status - The final status of the transaction.
   * @returns {Promise<Order>} The updated order.
   */
  public async handleWebhookUpdate(webhookData: { ref: string; status: string }) {
    // Step 1: Find our order in the database using the unique paypackRef.
    const order = await prisma.order.findUnique({
      where: { paypackRef: webhookData.ref },
    });

    // If no order matches the reference, we can ignore the webhook.
    // This could happen for various reasons (e.g., a test webhook).
    if (!order) {
      throw new Error('No order found for the given Paypack reference.');
    }

    // Step 2: Determine the new status based on the webhook status.
    let newStatus: OrderStatus;
    if (webhookData.status.toLowerCase() === 'successful') {
      newStatus = OrderStatus.COMPLETED;
    } else if (webhookData.status.toLowerCase() === 'failed') {
      newStatus = OrderStatus.FAILED;
    } else {
      // If the status is something else (e.g., 'pending'), we choose to ignore it
      // and wait for a final status update.
      console.log(`Ignoring webhook with non-final status: ${webhookData.status}`);
      return order; // Return the order without changes
    }

    // Step 3: Update the order's status in the database.
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
      },
    });

    console.log(`Order ${order.id} status updated to ${newStatus}`);
    return updatedOrder;
  }
}