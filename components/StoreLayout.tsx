'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import MobileBottomNav from './MobileBottomNav';
import ScrollToTop from './ScrollToTop';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
