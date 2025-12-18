
'use client';

import React, { useState, useEffect } from 'react';
import { CartProvider } from '@/context/cart-context';
import { StorefrontHeader } from '@/components/storefront-header';
import Link from 'next/link';
import StorefrontPageClient from './storefront-client-page';

// Define the component for the banner here so it can be used in the layout
function HeaderBannerSection() {
    return (
        <div className="bg-primary text-primary-foreground text-center p-2 text-sm">
            Free shipping on all orders over $75!
        </div>
    )
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState<any[]>([]);
  const [hasBanner, setHasBanner] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'UPDATE_SECTIONS') {
            const receivedSections = event.data.sections.map(({ id, type }: { id: string, type: string }) => ({ id, type }));
            setSections(receivedSections);
        }
    };

    window.addEventListener('message', handleMessage);

    return () => {
        window.removeEventListener('message', handleMessage);
    };
  }, []);


  useEffect(() => {
    const banner = sections.find(s => s.type === 'header-banner');
    setHasBanner(!!banner);
  }, [sections]);

  // Pass sections to the child StorefrontPage component
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === StorefrontPageClient) {
      // @ts-ignore
      const initialSections = child.props.initialSections || [];
      const sectionsToRender = sections.length > 0 ? sections : initialSections;
      const contentSections = sectionsToRender.filter(s => s.type !== 'header-banner');
      
      const newProps: { sections?: any[] } = {};
      if (sections.length > 0) {
        newProps.sections = contentSections;
      }
      
      return React.cloneElement(child, newProps);
    }
    return child;
  });

  return (
    <CartProvider>
      <div className="bg-background">
        {hasBanner && <HeaderBannerSection />}
        <StorefrontHeader />
        <main>{childrenWithProps}</main>
        <footer className="border-t bg-muted/40 py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
                <p className="text-sm text-muted-foreground">&copy; 2024 Curated Finds. All rights reserved.</p>
                <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <Link href="/storefront/track-order" className="text-sm hover:underline">Track Order</Link>
                    <Link href="/storefront/request-refund" className="text-sm hover:underline">Request Refund</Link>
                    <Link href="/storefront/pages/about-us" className="text-sm hover:underline">About Us</Link>
                    <Link href="/storefront/pages/contact-us" className="text-sm hover:underline">Contact Us</Link>
                    <Link href="/storefront/pages/faq" className="text-sm hover:underline">FAQ</Link>
                    <Link href="/storefront/pages/shipping-policy" className="text-sm hover:underline">Shipping</Link>
                    <Link href="/storefront/pages/return-policy" className="text-sm hover:underline">Returns</Link>
                    <Link href="/storefront/pages/terms-of-service" className="text-sm hover:underline">Terms of Service</Link>
                    <Link href="/storefront/pages/privacy-policy" className="text-sm hover:underline">Privacy Policy</Link>
                </nav>
            </div>
        </footer>
      </div>
    </CartProvider>
  );
}
