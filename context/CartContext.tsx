'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sp_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('sp_cart', JSON.stringify(items));
      } catch (e) {}
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    setItems(prev => {
      const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
      const chosenColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
      const price = product.sale_price && product.sale_price < product.price ? product.sale_price : product.price;

      const existingIndex = prev.findIndex(
        item => item.product_id === product.id && item.size === chosenSize && item.color === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, product.stock || 99);
        return updated;
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            title: product.title,
            price: price,
            quantity: Math.min(quantity, product.stock || 99),
            size: chosenSize,
            color: chosenColor,
            thumbnail_url: product.thumbnail_url,
            stock: product.stock
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setItems(prev =>
      prev.filter(
        item => !(item.product_id === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product_id === productId && item.size === size && item.color === color) {
          return { ...item, quantity: Math.min(quantity, item.stock || 99) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
