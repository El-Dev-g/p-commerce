'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProductGrid } from '@/components/product-grid';
import { ProductSidebar } from '@/components/product-sidebar';
import { getProducts, categories as allCategories } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';
import { searchProducts } from '@/ai/flows/search-products';
import { useToast } from '@/hooks/use-toast';

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiSearching, startAiSearchTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState('');
  const [useAiSearch, setUseAiSearch] = useState(false);
  const [aiSearchResultIds, setAiSearchResultIds] = useState<string[] | null>(null);

  const [priceRange, setPriceRange] = useState<number[]>([0, 150]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toast } = useToast();


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (useAiSearch && debouncedSearchTerm) {
      startAiSearchTransition(async () => {
        try {
          const result = await searchProducts(debouncedSearchTerm, allProducts);
          setAiSearchResultIds(result.productIds);
        } catch (error) {
          console.error("AI Search Failed:", error);
          toast({
            variant: "destructive",
            title: "AI Search Error",
            description: "There was a problem with the AI search. Please try again.",
          });
          setAiSearchResultIds([]); // Reset to avoid showing stale results
        }
      });
    } else {
        setAiSearchResultIds(null); // Clear AI results if not using AI search
    }
  }, [useAiSearch, debouncedSearchTerm, allProducts, toast]);


  const filteredProducts = useMemo(() => {
    let productsToFilter = allProducts;

    if (useAiSearch && aiSearchResultIds) {
        productsToFilter = allProducts.filter(p => aiSearchResultIds.includes(p.id));
    } else if (!useAiSearch && debouncedSearchTerm) {
        productsToFilter = allProducts.filter(product => 
            product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }

    return productsToFilter.filter((product) => {
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      return matchesPrice && matchesCategory;
    });
  }, [allProducts, debouncedSearchTerm, priceRange, selectedCategory, useAiSearch, aiSearchResultIds]);

  const isSearching = isLoading || isAiSearching;

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
              Explore our full collection of handcrafted goods from around the
              world.
            </p>
          </div>
          <div className="flex flex-col gap-12 md:flex-row">
            <ProductSidebar
              categories={allCategories}
              onSearchChange={setSearchTerm}
              onPriceChange={setPriceRange}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              selectedCategory={selectedCategory}
              useAiSearch={useAiSearch}
              onAiSearchChange={setUseAiSearch}
              isAiSearching={isAiSearching}
            />
            <div className="flex-1">
              {isSearching ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-80 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                    <h3 className='font-headline text-2xl font-semibold'>No Products Found</h3>
                    <p className='text-muted-foreground mt-2'>Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
