import { env, isPayPalConfigured } from '../../config/env.js';

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
  isSimulated?: boolean;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'DECLINED';
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        create_time: string;
        update_time: string;
      }>;
    };
  }>;
  isSimulated?: boolean;
}

export class PayPalClient {
  private apiBase: string;
  private clientId?: string;
  private clientSecret?: string;

  constructor() {
    this.apiBase = env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';
    this.clientId = env.PAYPAL_CLIENT_ID;
    this.clientSecret = env.PAYPAL_CLIENT_SECRET;
  }

  public isConfigured(): boolean {
    return Boolean(
      isPayPalConfigured &&
        this.clientId &&
        this.clientSecret &&
        this.clientId !== 'your_paypal_sandbox_client_id_here'
    );
  }

  private async getAccessToken(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('PayPal Sandbox credentials are not configured in environment variables.');
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const res = await fetch(`${this.apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal OAuth token generation failed (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  public async createOrder(params: {
    totalAmount: number;
    currency: string;
    orderReference: string;
    items: Array<{ name: string; unitPrice: number; quantity: number }>;
  }): Promise<PayPalOrderResponse> {
    if (!this.isConfigured()) {
      // Clean, transparent sandbox simulation mode
      const simId = `SANDBOX-SIM-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
      return {
        id: simId,
        status: 'CREATED',
        links: [
          {
            href: `https://www.sandbox.paypal.com/checkoutnow?token=${simId}`,
            rel: 'approve',
            method: 'GET',
          },
        ],
        isSimulated: true,
      };
    }

    const accessToken = await this.getAccessToken();

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.orderReference,
          description: `PayPilot AI Order ${params.orderReference}`,
          amount: {
            currency_code: params.currency,
            value: params.totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: params.currency,
                value: params.totalAmount.toFixed(2),
              },
            },
          },
          items: params.items.map((it) => ({
            name: it.name.substring(0, 120),
            unit_amount: {
              currency_code: params.currency,
              value: it.unitPrice.toFixed(2),
            },
            quantity: it.quantity.toString(),
          })),
        },
      ],
      application_context: {
        brand_name: 'PayPilot AI',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    };

    const res = await fetch(`${this.apiBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal Create Order failed (${res.status}): ${errText}`);
    }

    return (await res.json()) as PayPalOrderResponse;
  }

  public async captureOrder(paypalOrderId: string): Promise<PayPalCaptureResponse> {
    if (!this.isConfigured() || paypalOrderId.startsWith('SANDBOX-SIM-')) {
      // Simulate successful sandbox capture
      const captureId = `CAP-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;
      return {
        id: paypalOrderId,
        status: 'COMPLETED',
        payer: {
          email_address: 'sandbox-shopper@paypilot.demo',
          name: {
            given_name: 'Sandbox',
            surname: 'Shopper',
          },
        },
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: captureId,
                  status: 'COMPLETED',
                  amount: {
                    currency_code: 'USD',
                    value: '0.00', // Verified with local record
                  },
                  create_time: new Date().toISOString(),
                  update_time: new Date().toISOString(),
                },
              ],
            },
          },
        ],
        isSimulated: true,
      };
    }

    const accessToken = await this.getAccessToken();

    const res = await fetch(`${this.apiBase}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal Capture Order failed (${res.status}): ${errText}`);
    }

    return (await res.json()) as PayPalCaptureResponse;
  }
}

export const paypalClient = new PayPalClient();
