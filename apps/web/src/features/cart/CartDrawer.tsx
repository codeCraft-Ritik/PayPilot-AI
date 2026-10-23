import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { BudgetBar } from '../../components/shared/BudgetBar.js';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalUsd,
    formatPrice,
    setIsCheckoutOpen,
    userBudgetUsd,
  } = useApp();

  if (!isCartOpen) return null;

  const shippingUsd = cartSubtotalUsd >= 50 ? 0 : 10;
  const totalUsd = cartSubtotalUsd + shippingUsd;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border shadow-tactile-lg flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accent" />
              <h2 className="font-semibold text-sm text-foreground">Shopping Cart</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border text-foreground-muted">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-foreground-muted">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Your cart is empty</p>
                  <p className="text-xs text-foreground-muted mt-1">
                    Ask PayPilot AI to recommend items within your target budget.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Session Budget Progress */}
                {userBudgetUsd && (
                  <BudgetBar
                    currentAmountUsd={totalUsd}
                    targetBudgetUsd={userBudgetUsd}
                    label="Cart vs Target Budget"
                  />
                )}

                {/* Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 rounded border border-border bg-surface flex gap-3 items-center justify-between"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded border border-border shrink-0 bg-surface-subtle"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-foreground truncate" title={item.product.name}>
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] font-mono font-semibold text-foreground mt-0.5 tabular-nums">
                          {formatPrice(item.unitPrice)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-border rounded bg-surface-subtle">
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="p-1 hover:text-accent transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="p-1 hover:text-accent transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 text-foreground-muted hover:text-danger transition-colors text-xs"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-foreground tabular-nums">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer & Order Calculation */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-border bg-surface-subtle/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-foreground-muted">
                  <span>Authoritative Subtotal</span>
                  <span className="font-mono text-foreground font-medium tabular-nums">
                    {formatPrice(cartSubtotalUsd)}
                  </span>
                </div>
                <div className="flex justify-between text-foreground-muted">
                  <span>Shipping</span>
                  <span className="font-mono text-foreground font-medium">
                    {shippingUsd === 0 ? 'FREE ($50+)' : formatPrice(shippingUsd)}
                  </span>
                </div>
                <div className="flex justify-between text-foreground-muted text-[11px]">
                  <span>Estimated Tax (Sandbox)</span>
                  <span className="font-mono text-foreground">$0.00</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
                  <span>Calculated Order Total</span>
                  <span className="font-mono text-accent text-base tabular-nums">
                    {formatPrice(totalUsd)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-2.5 rounded bg-accent hover:bg-accent-hover text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-tactile active:scale-95"
              >
                <span>Proceed to PayPal Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-foreground-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Zero real charges • Sandbox verified checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
