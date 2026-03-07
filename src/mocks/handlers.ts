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
];
