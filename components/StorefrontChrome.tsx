'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface StorefrontChromeProps {
  children: React.ReactNode;
  storeName?: string;
  phoneContact?: string;
  whatsappNumber?: string;
  snapchatHandle?: string;
}

export default function StorefrontChrome({
  children,
  storeName,
  phoneContact,
  whatsappNumber,
  snapchatHandle,
}: StorefrontChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar
        storeName={storeName}
        whatsappNumber={whatsappNumber}
        snapchatHandle={snapchatHandle}
      />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={storeName}
        phoneContact={phoneContact}
        whatsappNumber={whatsappNumber}
        snapchatHandle={snapchatHandle}
      />
    </>
  );
}
