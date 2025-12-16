
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">Curated Finds</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Discover unique, handcrafted items from artisans around the world.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-headline font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/shipping-returns" className="text-sm text-muted-foreground hover:text-primary">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</Link></li>
              <li><Link href="/refund-request" className="text-sm text-muted-foreground hover:text-primary">Request a Refund</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container flex items-center justify-center py-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Curated Finds. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
