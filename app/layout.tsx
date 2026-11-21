import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StoreLayout from '@/components/StoreLayout';

export const metadata: Metadata = {
  metadataBase: new URL('https://secretpetal.store'),
  title: 'Secret Petal | Inner Beauty, Every Day | Ladies Undergarments',
  description: 'Shop premium women intimate wear, wireless comfort posture bras, cute plush sets, and seamless shapewear in Pakistan. 100% discreet packaging and cash on delivery.',
  icons: {
    icon: '/images/icon.png',
    shortcut: '/images/icon.png',
    apple: '/images/icon.png',
  },
  openGraph: {
    title: 'Secret Petal - Women\'s Intimate Wear & Lingerie',
    description: 'Inner Beauty, Every Day. Quality products, affordable prices, and 100% discreet delivery across Pakistan.',
    url: 'https://secretpetal.store',
    siteName: 'Secret Petal',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Secret Petal',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-gray-900 bg-white antialiased selection:bg-rose-100 selection:text-burgundy">
        <CartProvider>
          <StoreLayout>{children}</StoreLayout>
        </CartProvider>
      </body>
    </html>
  );
}
