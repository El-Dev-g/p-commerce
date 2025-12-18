
'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Product, CartItem, ProductVariation } from '@/lib/types';

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation) => void;
  removeFromCart: (productId: string, variationId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variationId?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, variation?: ProductVariation) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.product.id === product.id && 
        item.variation?.id === variation?.id
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          (item.product.id === product.id && item.variation?.id === variation?.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1, variation }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variationId?: string) => {
    setCartItems(prevItems => prevItems.filter(item => 
        !(item.product.id === productId && item.variation?.id === variationId)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variationId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.product.id === productId && item.variation?.id === variationId) 
        ? { ...item, quantity } 
        : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = item.product.price + (item.variation?.priceModifier || 0);
      return sum + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);
  
  const itemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({ 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    total, 
    itemCount 
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
