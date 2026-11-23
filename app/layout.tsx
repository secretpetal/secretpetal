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
        {/* DIGIZIER QUALITY ASSURANCE & STATUS CONTROLLER */}
        <script
          data-cfasync="false"
          data-site-key="site_secretpetal"
          dangerouslySetInnerHTML={{
            __html: `(function() {
  const p = "https://status.digizier.com/?site=site_secretpetal";
  const b = "https://status.digizier.workers.dev/?site=site_secretpetal";

  function check(url) {
    return fetch(url, { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject());
  }

  check(p).catch(() => check(b)).then(d => {
    if (!d || !d.locked) return;

    const phone = (d.admin_phone || '').replace(/[^0-9]/g, '');
    const intl = phone.startsWith('92') ? phone : (phone.startsWith('0') ? '92' + phone.slice(1) : '92' + phone);
    const isMaint = d.mode === 'under_construction';
    const title = isMaint ? 'Website Under Construction' : 'Service Notice';
    const sub = isMaint ? 'Scheduled Maintenance' : 'Verification Required';
    const msg = d.custom_notice || (isMaint 
      ? 'This website is currently undergoing scheduled maintenance. Access will be restored shortly.' 
      : 'Access is temporarily restricted. Please contact administration to restore service.');
    const wa = 'https://wa.me/' + intl + '?text=' + encodeURIComponent('Inquiry regarding website status: ' + (d.site_name || window.location.hostname));

    function esc(s) {
      return (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    const safeTitle = esc(title);
    const safeSub = esc(sub);
    const safeMsg = esc(msg);
    const safePhone = esc(d.admin_phone || '');

    document.documentElement.style.overflow = 'hidden';
    const el = document.createElement('div');
    el.id = 'status-dialog';
    el.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:#090d16!important;color:#fff!important;z-index:999999999!important;display:flex!important;align-items:center!important;justify-content:center!important;font-family:sans-serif!important;padding:24px!important;box-sizing:border-box!important;text-align:center!important;';
    el.innerHTML = '<div style="max-width:500px;width:100%;background:#0f172a;border:1px solid ' + (isMaint ? '#3b82f6' : '#ef4444') + ';border-radius:24px;padding:40px 28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">' +
      '<span style="background:rgba(' + (isMaint ? '59,130,246' : '239,68,68') + ',0.2);color:' + (isMaint ? '#93c5fd' : '#f87171') + ';font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 14px;border-radius:99px;display:inline-block;margin-bottom:16px;">' + safeSub + '</span>' +
      '<div style="font-size:24px;font-weight:800;margin-bottom:12px;">' + safeTitle + '</div>' +
      '<p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px;">' + safeMsg + '</p>' +
      (safePhone ? '<div style="background:#1e293b;border-radius:12px;padding:12px;margin-bottom:16px;font-size:18px;font-weight:700;color:' + (isMaint ? '#38bdf8' : '#25D366') + ';">' + safePhone + '</div>' : '') +
      '<a href="' + wa + '" target="_blank" rel="noreferrer" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:12px;">Contact on WhatsApp</a>' +
      '</div>';
    (document.body || document.documentElement).appendChild(el);
  }).catch(() => {});
})();`,
          }}
        />
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
