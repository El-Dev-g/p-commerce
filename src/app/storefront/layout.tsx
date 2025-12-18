
import { CartProvider } from '@/context/cart-context';
import { StorefrontHeader } from '@/components/storefront-header';
import Link from 'next/link';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="bg-background">
        <StorefrontHeader />
        <main>{children}</main>
        <footer className="border-t bg-muted/40 py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
                <p className="text-sm text-muted-foreground">&copy; 2024 Curated Finds. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6">
                    <Link href="/storefront/pages/terms-of-service" className="text-sm hover:underline">Terms of Service</Link>
                    <Link href="/storefront/pages/privacy-policy" className="text-sm hover:underline">Privacy Policy</Link>
                </nav>
            </div>
        </footer>
      </div>
    </CartProvider>
  );
}
