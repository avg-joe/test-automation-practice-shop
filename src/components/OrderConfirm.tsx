import { useStore } from '@nanostores/react';
import { orderInfo, shippingInfo } from '../stores/checkout';
import { getTestId } from '../utils/testId';

export default function OrderConfirm() {
  const order = useStore(orderInfo);
  const shipping = useStore(shippingInfo);

  if (!order) {
    return (
      <div className="confirm-layout">
        <div className="confirm-no-order" data-testid={getTestId('confirm-no-order')}>
          <div className="confirm-no-order__icon">🤔</div>
          <h2 className="confirm-no-order__title">No order found</h2>
          <p className="confirm-no-order__subtitle">
            It looks like you haven't placed an order yet.
          </p>
          <a href="/" className="confirm-actions__primary" data-testid={getTestId('confirm-shop-btn')}>
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="confirm-layout">
      {/* Success Banner */}
      <div className="confirm-banner" data-testid={getTestId('confirm-banner')}>
        <div className="confirm-banner__icon">🎉</div>
        <h1 className="confirm-banner__title">Order Confirmed!</h1>
        <p className="confirm-banner__subtitle">
          Thank you for your purchase. A confirmation email is on its way.
        </p>
        <div className="confirm-banner__order-id" data-testid={getTestId('confirm-order-id')}>
          Order #{order.orderId}
        </div>
        <p className="confirm-banner__message" data-testid={getTestId('confirm-message')}>
          {order.message}
        </p>
      </div>

      {/* Shipping + Payment Info */}
      {shipping && (
        <div className="confirm-info-grid" data-testid={getTestId('confirm-info')}>
          <div className="confirm-info-card" data-testid={getTestId('confirm-shipping-info')}>
            <p className="confirm-info-card__title">Shipping Address</p>
            <p className="confirm-info-card__name">
              {shipping.firstName} {shipping.lastName}
            </p>
            <p className="confirm-info-card__text">
              {shipping.address}
              {shipping.apartment ? `, ${shipping.apartment}` : ''}
              <br />
              {shipping.city}, {shipping.state} {shipping.zip}
              <br />
              {shipping.country}
            </p>
          </div>

          <div className="confirm-info-card" data-testid={getTestId('confirm-total-info')}>
            <p className="confirm-info-card__title">Order Total</p>
            <p className="confirm-info-card__name" data-testid={getTestId('confirm-total')}>
              ${order.total.toFixed(2)}
            </p>
            <p className="confirm-info-card__text">
              Including all taxes and shipping
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="confirm-actions" data-testid={getTestId('confirm-actions')}>
        <a href="/" className="confirm-actions__primary" data-testid={getTestId('confirm-continue-btn')}>
          Continue Shopping
        </a>
        <a href="/contact" className="confirm-actions__secondary" data-testid={getTestId('confirm-contact-btn')}>
          Need Help?
        </a>
      </div>
    </div>
  );
}
