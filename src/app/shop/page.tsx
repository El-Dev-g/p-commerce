import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProductGrid } from '@/components/product-grid';

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              All Products
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
              Explore our full collection of handcrafted goods from around the world.
            </p>
          </div>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
