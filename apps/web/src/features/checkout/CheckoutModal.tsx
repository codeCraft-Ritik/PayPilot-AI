import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Lock,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalUsd,
    formatPrice,
    currency,
    clearCart,
  } = useApp();

  const navigate = useNavigate();

  const [step, setStep] = useState<'review' | 'authorizing' | 'capturing' | 'error'>('review');
  const [hasUserApproved, setHasUserApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  if (!isCheckoutOpen || cart.length === 0) return null;

  const shippingUsd = cartSubtotalUsd >= 50 ? 0 : 10;
  const totalUsd = cartSubtotalUsd + shippingUsd;

  const handleStartCheckout = async () => {
    if (!hasUserApproved) return;
    setErrorMessage(null);
    setStep('authorizing');

    try {
      // 1. Request server to create PayPal order with recalculation
      const payload = {
        items: cart.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
        currency: 'USD' as const,
      };

      const result = await api.createCheckoutOrder(payload);
      setCreatedOrderId(result.order.id);
      setPaypalOrderId(result.paypalOrderId);
      setIsSimulatedMode(result.isSimulated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize PayPal order');
      setStep('error');
    }
  };

  const handleAuthorizeAndCapture = async () => {
    if (!createdOrderId || !paypalOrderId) return;
    setStep('capturing');
    setErrorMessage(null);

    try {
      // 2. Server verifies and captures payment
      const verifiedOrder = await api.captureCheckoutPayment({
        orderId: createdOrderId,
        paypalOrderId,
      });

      // Clear cart
      clearCart();
      setIsCheckoutOpen(false);

      // Navigate to order confirmation
      navigate(`/order/${verifiedOrder.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment capture failed');
      setStep('error');
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('review');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-xs transition-opacity" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-tactile-lg p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-surface-subtle border border-border flex items-center justify-center text-accent">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">PayPal Sandbox Checkout</h2>
              <p className="text-[11px] font-mono text-foreground-muted">
                DEMONSTRATION PAYMENT GATEWAY • VERIFIED SERVER CAPTURE
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Pre-Checkout Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div className="rounded border border-border bg-surface-subtle p-3 space-y-2">
              <div className="flex justify-between text-xs text-foreground-muted font-mono uppercase tracking-wider">
                <span>Selected Products</span>
                <span>Subtotal</span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {cart.map((it) => (
                  <div key={it.productId} className="flex justify-between items-center text-xs">
                    <span className="truncate pr-2 text-foreground">
                      {it.quantity}x {it.product.name}
                    </span>
                    <span className="font-mono text-foreground font-medium shrink-0">
                      {formatPrice(it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border/80 space-y-1 text-xs">
                <div className="flex justify-between text-foreground-muted">
                  <span>Shipping Fee</span>
                  <span className="font-mono">{shippingUsd === 0 ? 'FREE' : formatPrice(shippingUsd)}</span>
                </div>
                <div className="flex justify-between text-foreground-muted">
                  <span>Demo Sales Tax</span>
                  <span className="font-mono">$0.00</span>
                </div>
                <div className="pt-1 flex justify-between text-sm font-bold text-foreground">
                  <span>Authorized Total</span>
                  <span className="font-mono text-accent text-base tabular-nums">
                    {formatPrice(totalUsd, true)}
                  </span>
                </div>
                {currency === 'INR' && (
                  <p className="text-[10px] font-mono text-foreground-muted text-right">
                    (PayPal transaction processed as ${totalUsd.toFixed(2)} USD at 1 USD ≈ ₹83.5)
                  </p>
                )}
              </div>
            </div>

            {/* Explicit User Approval Requirement */}
            <div className="p-3 rounded border border-accent-border bg-accent-subtle/50 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasUserApproved}
                  onChange={(e) => setHasUserApproved(e.target.checked)}
                  className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-xs text-foreground leading-snug">
                  <strong>Explicit User Approval:</strong> I approve submitting this order of{' '}
                  <span className="font-mono font-semibold">${totalUsd.toFixed(2)} USD</span> to the PayPal
                  Sandbox for demonstration payment.
                </span>
              </label>
            </div>

            <button
              onClick={handleStartCheckout}
              disabled={!hasUserApproved}
              className={`w-full py-2.5 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-tactile ${
                hasUserApproved
                  ? 'bg-accent hover:bg-accent-hover text-white active:scale-95'
                  : 'bg-surface-subtle text-foreground-muted border border-border cursor-not-allowed'
              }`}
            >
              <span>Initialize PayPal Sandbox Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 2: Authorizing / Ready to Capture */}
        {step === 'authorizing' && (
          <div className="space-y-4 text-center py-2">
            <div className="p-4 rounded border border-border bg-surface-subtle space-y-3">
              <div className="flex items-center justify-center gap-2 text-foreground font-semibold text-sm">
                <CreditCard className="w-4 h-4 text-accent" />
                <span>PayPal Sandbox Session Ready</span>
              </div>
              <p className="text-xs text-foreground-muted">
                Order Reference:{' '}
                <span className="font-mono text-foreground font-semibold">{createdOrderId}</span>
              </p>
              <p className="text-xs text-foreground-muted">
                PayPal Reference:{' '}
                <span className="font-mono text-foreground font-semibold">{paypalOrderId}</span>
              </p>

              <div className="p-2.5 rounded bg-surface border border-border text-[11px] font-mono text-foreground-muted text-left">
                • Intent: CAPTURE
                <br />• Total Amount: ${totalUsd.toFixed(2)} USD
                <br />• Environment: {isSimulatedMode ? 'Sandbox Simulation' : 'Live PayPal Sandbox'}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleAuthorizeAndCapture}
                className="w-full py-2.5 rounded bg-[#0070BA] hover:bg-[#003087] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-tactile transition-colors active:scale-95"
              >
                <span>Authorize & Complete Sandbox Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2 text-xs font-mono text-foreground-muted hover:text-foreground"
              >
                Cancel Sandbox Transaction
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Capturing & Verifying Payment */}
        {step === 'capturing' && (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <div>
              <h3 className="font-semibold text-sm text-foreground">Verifying Payment with PayPal API</h3>
              <p className="text-xs text-foreground-muted mt-1 font-mono">
                Capturing order {paypalOrderId} • Recalculating ledger...
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Error State */}
        {step === 'error' && (
          <div className="space-y-4">
            <div className="p-3 rounded border border-danger-border bg-danger-subtle text-xs text-danger space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Transaction Notice</span>
              </div>
              <p className="pl-5">{errorMessage}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('review')}
                className="flex-1 py-2 rounded border border-border bg-surface text-xs font-medium hover:bg-surface-subtle"
              >
                Review Order Again
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-2 rounded bg-foreground text-surface text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-foreground-muted">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Server-side Verified</span>
          </div>
          <span>Strict Price Recalculation Active</span>
        </div>
      </div>
    </div>
  );
};
