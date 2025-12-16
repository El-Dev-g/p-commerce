import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProductGrid } from '@/components/product-grid';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2596&auto=format&fit=crop"
            alt="Hero image of curated products"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="container relative flex h-full flex-col items-start justify-end pb-16 text-primary-foreground">
            <h1 className="font-headline text-5xl font-bold md:text-7xl">
              Artisanal Goods
            </h1>
            <p className="mt-4 max-w-lg text-lg text-primary-foreground/80">
              Discover unique, handcrafted items from artisans around the world.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/shop">
                Shop The Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
        
        <section className="container py-12 md:py-20">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Featured Products
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
              A curated selection of our favorite items, just for you.
            </p>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
