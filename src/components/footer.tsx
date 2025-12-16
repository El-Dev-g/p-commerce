import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
           <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">Curated Finds</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Curated Finds. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
