
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';

export default function StorefrontPage() {
  return (
    <div className="bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/storefront" className="flex items-center gap-2">
            <span className="text-xl font-bold">Curated Finds</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/storefront" className="hover:underline">Home</Link>
            <Link href="#" className="hover:underline">Catalog</Link>
            <Link href="#" className="hover:underline">About</Link>
            <Link href="#" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>
      <main>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://picsum.photos/seed/storefront-hero/1200/800"
                alt="Hero Image"
                width={1200}
                height={800}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                data-ai-hint="elegant storefront display"
              />
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Discover Our Curated Collection</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Explore a world of hand-picked items that blend quality craftsmanship with timeless design.
                </p>
                <Link href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-fit">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Products</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                        Check out some of our favorite and most popular items.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.slice(0, 4).map(product => (
                        <Card key={product.id}>
                            <CardContent className="p-0">
                                <Image 
                                    src={product.image.src} 
                                    alt={product.image.alt}
                                    width={400}
                                    height={300}
                                    className="h-auto w-full rounded-t-lg object-cover aspect-[4/3]"
                                />
                            </CardContent>
                            <CardHeader>
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t bg-muted/40 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
            <p className="text-sm text-muted-foreground">&copy; 2024 Curated Finds. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6">
                <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
                <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
            </nav>
        </div>
      </footer>
    </div>
  );
}
