const Paypack = require('paypack-js').default;
import type { PaypackConfig } from 'paypack-js';
import dotenv from 'dotenv';
import crypto from 'crypto'; 

dotenv.config();

export class PaypackService {
  private static instance: PaypackService;
  public paypack: any;
  private webhookSecret: string;

  private constructor() {
    const clientId = process.env.PAYPACK_CLIENT_ID;
    const clientSecret = process.env.PAYPACK_CLIENT_SECRET;
    // LOAD THE WEBHOOK SECRET FROM .env
    const webhookSecret = process.env.PAYPACK_WEBHOOK_SECRET;

    // UPDATE THE VALIDATION
    if (!clientId || !clientSecret || !webhookSecret) {
      throw new Error(
        'Paypack client ID, client secret, AND webhook secret must be set in the .env file.'
      );
    }

    // STORE THE WEBHOOK SECRET
    this.webhookSecret = webhookSecret;

    const config: PaypackConfig = {
      client_id: clientId,
      client_secret: clientSecret,
    };

    this.paypack = new Paypack(config);
  }

  public static getInstance(): PaypackService {
    if (!PaypackService.instance) {
      PaypackService.instance = new PaypackService();
    }
    return PaypackService.instance;
  }

  public async initiateCashin(options: {
    amount: number;
    phoneNumber: string;
  }): Promise<string> {
    try {
      const response = await this.paypack.cashin({
        amount: options.amount,
        number: options.phoneNumber,
      });

      return response.data.ref;
    } catch (error) {
      console.error('Paypack cash-in failed:', error);
      throw new Error('Failed to initiate payment with Paypack.');
    }
  }

  public verifyWebhookSignature(
    signature: string | undefined,
    rawBody: Buffer
  ): boolean {
    if (!signature) {
      console.warn('Webhook received without a signature.');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('base64');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }
}

export const paypackService = PaypackService.getInstance();