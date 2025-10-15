import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive()
      .describe('Amount must be a positive number.'),
    customerPhone: z
      .string()
      .min(10)
      .describe('Customer phone number is required and must be at least 10 characters.'),
  }),
});

// Schema for the payment request
export const payForOrderSchema = z.object({
  params: z.object({
    orderId: z
      .string()
      .uuid()
      .describe('Order ID is required and must be a valid UUID.'),
  }),
});

// Schema for the Paypack webhook payload
export const webhookPayloadSchema = z.object({
  body: z.object({
    event_kind: z.string(),
    data: z.object({
      ref: z.string(),
      status: z.string(),
    }),
  }),
});
