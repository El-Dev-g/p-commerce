import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProductGrid } from '@/components/product-grid';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="mb-10 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Discover Our Collection
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
              A curated selection of unique items, thoughtfully chosen for their
              quality and character.
            </p>
          </div>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
