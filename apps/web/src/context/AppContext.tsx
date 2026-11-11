import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  SupportedCurrency,
  convertCurrency,
  formatCurrency,
} from '@paypilot/shared';

interface AppContextType {
  // Currency
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  formatPrice: (amountUsd: number, showCode?: boolean) => string;
  getDisplayPrice: (amountUsd: number) => number;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, openCart?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalUsd: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Budget
  userBudgetUsd: number | null;
  setUserBudgetUsd: (amount: number | null) => void;

  // Comparison
  comparedProductIds: string[];
  toggleCompare: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;

  // Modals & Navigation
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'paypilot_cart_v1';
const CURRENCY_STORAGE_KEY = 'paypilot_currency_v1';
const BUDGET_STORAGE_KEY = 'paypilot_budget_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Currency
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return saved === 'INR' ? 'INR' : 'USD';
  });

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    localStorage.setItem(CURRENCY_STORAGE_KEY, c);
  };

  const getDisplayPrice = (amountUsd: number): number => {
    return convertCurrency(amountUsd, 'USD', currency);
  };

  const formatPrice = (amountUsd: number, showCode: boolean = false): string => {
    const displayAmount = getDisplayPrice(amountUsd);
    return formatCurrency(displayAmount, currency, showCode);
  };

  // 2. Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1, openCart: boolean = true) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.productId === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: Math.min(20, next[idx].quantity + quantity),
        };
        return next;
      }
      return [...prev, { productId: product.id, product, quantity, unitPrice: product.price }];
    });
    if (openCart) {
      setIsCheckoutOpenState(false);
      setIsCartOpenState(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(20, quantity) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalUsd = Math.round(
    cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100
  ) / 100;

  // 3. Budget Intelligence
  const [userBudgetUsd, setUserBudgetUsdState] = useState<number | null>(() => {
    const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
    return saved ? Number(saved) : null;
  });

  const setUserBudgetUsd = (amount: number | null) => {
    setUserBudgetUsdState(amount);
    if (amount) {
      localStorage.setItem(BUDGET_STORAGE_KEY, amount.toString());
    } else {
      localStorage.removeItem(BUDGET_STORAGE_KEY);
    }
  };

  // 4. Comparison
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);

  const toggleCompare = (productId: string) => {
    setComparedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        // limit to 4
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const clearComparison = () => setComparedProductIds([]);
  const isInComparison = (productId: string) => comparedProductIds.includes(productId);

  // 5. Modals (mutually exclusive overlays to prevent drawer/modal collision)
  const [isCartOpen, setIsCartOpenState] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpenState] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  const setIsCartOpen = (open: boolean) => {
    if (open) {
      setIsCheckoutOpenState(false);
    }
    setIsCartOpenState(open);
  };

  const setIsCheckoutOpen = (open: boolean) => {
    if (open) {
      setIsCartOpenState(false);
    }
    setIsCheckoutOpenState(open);
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        getDisplayPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalUsd,
        isCartOpen,
        setIsCartOpen,
        userBudgetUsd,
        setUserBudgetUsd,
        comparedProductIds,
        toggleCompare,
        clearComparison,
        isInComparison,
        selectedProductForDetail,
        setSelectedProductForDetail,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
