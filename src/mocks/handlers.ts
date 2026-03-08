import { http, HttpResponse, delay } from 'msw';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// In-memory cart storage (resets on page reload)
const memoryCart: CartItem[] = [];

export const handlers = [
  /**
   * POST /api/login
   * Accepts any JSON body. If username === "student", returns 200 + fake token.
   * Otherwise returns 401. Delays 1000ms to teach "waiting" strategies.
   */
  http.post('/api/login', async ({ request }) => {
    await delay(1000);

    const body = await request.json() as { username?: string; password?: string };

    if (body.username === 'student') {
      return HttpResponse.json(
        {
          success: true,
          token: 'fake-jwt-token-abc123xyz',
          user: { id: 1, username: 'student', name: 'Test Student' },
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  /**
   * POST /api/cart/add
   * Adds item to in-memory cart. Returns 200. Delays 500ms.
   */
  http.post('/api/cart/add', async ({ request }) => {
    await delay(500);

    const item = await request.json() as CartItem;
    const existing = memoryCart.find((i) => i.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      memoryCart.push({ ...item, quantity: item.quantity ?? 1 });
    }

    return HttpResponse.json(
      { success: true, cart: memoryCart, itemCount: memoryCart.reduce((t, i) => t + i.quantity, 0) },
      { status: 200 }
    );
  }),

  /**
   * POST /api/cart/remove
   * Removes an item from the in-memory cart by id. Delays 300ms.
   */
  http.post('/api/cart/remove', async ({ request }) => {
    await delay(300);

    const body = await request.json() as { id: string };
    const index = memoryCart.findIndex((i) => i.id === body.id);
    if (index !== -1) {
      memoryCart.splice(index, 1);
    }

    return HttpResponse.json(
      { success: true, cart: memoryCart, itemCount: memoryCart.reduce((t, i) => t + i.quantity, 0) },
      { status: 200 }
    );
  }),

  /**
   * POST /api/cart/update
   * Updates quantity of an item in the in-memory cart. Delays 300ms.
   */
  http.post('/api/cart/update', async ({ request }) => {
    await delay(300);

    const body = await request.json() as { id: string; quantity: number };
    const item = memoryCart.find((i) => i.id === body.id);
    if (item) {
      item.quantity = body.quantity;
    }

    return HttpResponse.json(
      { success: true, cart: memoryCart, itemCount: memoryCart.reduce((t, i) => t + i.quantity, 0) },
      { status: 200 }
    );
  }),

  /**
   * POST /api/cart/clear
   * Clears all items from the in-memory cart. Delays 300ms.
   */
  http.post('/api/cart/clear', async () => {
    await delay(300);

    memoryCart.length = 0;

    return HttpResponse.json(
      { success: true, cart: [], itemCount: 0 },
      { status: 200 }
    );
  }),

  /**
   * POST /api/coupon/apply
   * Validates a coupon code. Returns discount info. Delays 500ms.
   * Valid codes: SAVE10 (10%), SUMMER20 (20%), FREESHIP (free shipping).
   */
  http.post('/api/coupon/apply', async ({ request }) => {
    await delay(500);

    const body = await request.json() as { code: string };
    const code = (body.code ?? '').trim().toUpperCase();

    const coupons: Record<string, { discountPercent: number; freeShipping: boolean; label: string }> = {
      SAVE10: { discountPercent: 10, freeShipping: false, label: '10% off your order' },
      SUMMER20: { discountPercent: 20, freeShipping: false, label: '20% off your order' },
      FREESHIP: { discountPercent: 0, freeShipping: true, label: 'Free shipping on your order' },
    };

    const coupon = coupons[code];
    if (!coupon) {
      return HttpResponse.json(
        { success: false, message: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        success: true,
        code,
        discountPercent: coupon.discountPercent,
        freeShipping: coupon.freeShipping,
        label: coupon.label,
      },
      { status: 200 }
    );
  }),

  /**
   * POST /api/shipping
   * Saves shipping information. Returns 200. Delays 500ms.
   */
  http.post('/api/shipping', async ({ request }) => {
    await delay(500);

    const body = await request.json() as {
      firstName?: string;
      lastName?: string;
      email?: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      method?: string;
    };

    return HttpResponse.json(
      {
        success: true,
        message: `Shipping details saved for ${body.firstName ?? 'Customer'} ${body.lastName ?? ''}`.trim(),
        method: body.method ?? 'standard',
      },
      { status: 200 }
    );
  }),

  /**
   * POST /api/checkout
   * Randomly fails 10% of requests with 500 error (to teach flaky test handling).
   * Deterministic failure can be triggered via X-Force-Failure: true header.
   */
  http.post('/api/checkout', async ({ request }) => {
    await delay(800);

    const forceFailure = request.headers.get('X-Force-Failure');

    if (forceFailure === 'true' || Math.random() < 0.1) {
      return HttpResponse.json(
        { success: false, message: 'Internal Server Error – Payment gateway unavailable' },
        { status: 500 }
      );
    }

    const body = await request.json() as { name?: string; email?: string; address?: string };

    // Clear the in-memory cart after successful checkout
    memoryCart.length = 0;

    return HttpResponse.json(
      {
        success: true,
        orderId: `ORD-${Date.now()}`,
        message: `Order confirmed for ${body.name ?? 'Customer'}`,
      },
      { status: 200 }
    );
  }),

  /**
   * POST /api/contact
   * Accepts contact form data. Returns 200 with success message. Delays 600ms.
   */
  http.post('/api/contact', async ({ request }) => {
    await delay(600);

    const body = await request.json() as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };

    return HttpResponse.json(
      {
        success: true,
        message: `Thank you ${body.firstName ?? 'for contacting us'}! We'll get back to you within 24 hours.`,
        ticketId: `TICKET-${Date.now()}`,
      },
      { status: 200 }
    );
  }),
];
