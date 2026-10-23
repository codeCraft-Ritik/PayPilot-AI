import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  Printer,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { OrderRecord } from '@paypilot/shared';
import { api } from '../../services/api.js';
import { useApp } from '../../context/AppContext.js';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { formatPrice } = useApp();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await api.getOrderById(id);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
        <p className="text-xs font-mono text-foreground-muted">
          Retrieving server-verified transaction record...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-lg border border-danger-border bg-danger-subtle text-xs text-danger">
          <p className="font-semibold">Order Not Found</p>
          <p className="mt-1">{error || 'Unable to retrieve order details.'}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-foreground text-surface text-xs font-medium"
        >
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Success Badge Banner */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-success-subtle border border-success-border text-success flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sandbox Payment Verified
        </h1>
        <p className="text-xs text-foreground-muted max-w-sm mx-auto">
          Your order has been captured and verified on the PayPal sandbox gateway. No live financial charges were made.
        </p>
      </div>

      {/* Main Receipt Card */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-tactile-md space-y-6 print:border-none print:shadow-none">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border text-xs">
          <div>
            <span className="font-mono text-[10px] uppercase text-foreground-muted block">
              Order Reference
            </span>
            <span className="font-mono font-bold text-sm text-foreground">
              {order.orderNumber}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="font-mono text-[10px] uppercase text-foreground-muted block">
              Payment Status
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-success-subtle border border-success-border text-success font-mono font-semibold text-[11px]">
              <ShieldCheck className="w-3 h-3" />
              <span>{order.status} (CAPTURED)</span>
            </span>
          </div>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg border border-border bg-surface-subtle text-xs font-mono">
          <div>
            <span className="text-[10px] text-foreground-muted block">Transaction Timestamp</span>
            <span className="text-foreground font-medium text-[11px]">
              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-foreground-muted block">PayPal Capture ID</span>
            <span className="text-foreground font-semibold text-[11px] truncate block" title={order.paypalCaptureId}>
              {order.paypalCaptureId || 'SIMULATED-CAP'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-foreground-muted block">Gateway Account</span>
            <span className="text-foreground text-[11px] truncate block">
              {order.payerEmail || 'sandbox-buyer@paypal'}
            </span>
          </div>
        </div>

        {/* Itemized Breakdown Table */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase text-foreground tracking-wider">
            Purchased Products
          </h2>

          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
            {order.items.map((it) => (
              <div key={it.productId} className="p-3 bg-surface flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-foreground block">{it.name}</span>
                  <span className="text-[11px] font-mono text-foreground-muted">
                    Qty {it.quantity} × {formatPrice(it.unitPrice)}
                  </span>
                </div>
                <span className="font-mono font-semibold text-foreground tabular-nums">
                  {formatPrice(it.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary Calculation */}
        <div className="p-4 rounded-lg border border-border bg-surface-subtle/50 space-y-2 text-xs">
          <div className="flex justify-between text-foreground-muted">
            <span>Authoritative Subtotal</span>
            <span className="font-mono text-foreground">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-foreground-muted">
            <span>Shipping</span>
            <span className="font-mono text-foreground">
              {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-foreground-muted text-[11px]">
            <span>Taxes (Sandbox Demo)</span>
            <span className="font-mono text-foreground">$0.00</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-foreground">
            <span>Verified Total Charged</span>
            <span className="font-mono text-accent text-lg tabular-nums">
              ${order.totalAmount.toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 rounded border border-border bg-surface hover:bg-surface-subtle text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <Link
            to="/insights"
            className="w-full sm:w-auto px-4 py-2 rounded bg-foreground text-surface hover:bg-accent text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-tactile ml-auto"
          >
            <span>View Spending Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
