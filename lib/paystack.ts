/**
 * Official Paystack Ghana API integration client.
 * Supports Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Card payments.
 * 
 * Documentation: https://paystack.com/docs/api/
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export interface InitializePaymentParams {
  email: string;
  amountInGhs: number; // Decimal in GHS, e.g. 150.00
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
  channels?: string[]; // ['mobile_money', 'card']
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: string; // 'success', 'failed', 'abandoned'
    reference: string;
    amount: number; // in pesewas
    currency: string;
    channel: string;
    paid_at: string;
    customer: {
      email: string;
      phone: string;
    };
  };
}

export async function initializePaystackPayment(params: InitializePaymentParams): Promise<PaystackInitResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured in store environment.');
  }

  // Paystack expects amount in minor units (Pesewas in GHS, so GHS 100 = 10000 pesewas)
  const amountInPesewas = Math.round(params.amountInGhs * 100);

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: amountInPesewas,
      currency: 'GHS',
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
      channels: params.channels || ['mobile_money', 'card'],
    }),
  });

  return response.json();
}

export async function verifyPaystackPayment(reference: string): Promise<PaystackVerifyResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured in store environment.');
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  return response.json();
}
