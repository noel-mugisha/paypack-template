import Paypack, { PaypackConfig } from 'paypack-js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @class PaypackService
 * @description A singleton service to handle all interactions with the Paypack SDK.
 * This ensures we only have one instance of the Paypack client configured
 * for the entire application.
 */
export class PaypackService {
  private static instance: PaypackService;

  public paypack: Paypack;

  private constructor() {
    const clientId = process.env.PAYPACK_CLIENT_ID;
    const clientSecret = process.env.PAYPACK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        'Paypack client ID and client secret must be set in the .env file.'
      );
    }

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

  /**
   * @method initiateCashin
   * @description Initiates a cash-in (payment request) through Paypack.
   * @param {object} options - The payment options.
   * @param {number} options.amount - The amount to be charged.
   * @param {string} options.phoneNumber - The customer's phone number.
   * @returns {Promise<string>} The transaction reference ID from Paypack.
   */
  public async initiateCashin(options: {
    amount: number;
    phoneNumber: string;
  }): Promise<string> {
    try {
      const response = await this.paypack.cashin({
        amount: options.amount,
        number: options.phoneNumber
      });

      return response.data.ref;
    } catch (error) {
      console.error('Paypack cash-in failed:', error);
      throw new Error('Failed to initiate payment with Paypack.');
    }
  }
}

export const paypackService = PaypackService.getInstance();