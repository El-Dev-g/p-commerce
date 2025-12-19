
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Search, Upload } from 'lucide-react';
import { searchCjProducts } from '@/ai/flows/search-cj-products';
import type { SearchCjProductsOutput } from '@/ai/flows/search-cj-products';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { importProductAction } from './actions';

type SearchResult = SearchCjProductsOutput['products'];

export default function ImportProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult>([]);
  const [importingIds, setImportingIds] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: 'destructive',
        title: 'Search query cannot be empty.',
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    try {
      const results = await searchCjProducts({ query: searchQuery });
      setSearchResults(results.products);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: 'Could not fetch products from supplier.',
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleImport = async (product: SearchResult[0]) => {
    setImportingIds(prev => [...prev, product.id]);
    try {
        const result = await importProductAction(product);
        if (result.success) {
            toast({
                title: 'Product Imported!',
                description: `${product.title} has been added to your store.`,
            });
            // Optionally, remove the product from the search results
            setSearchResults(prev => prev.filter(p => p.id !== product.id));
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: (error as Error).message || 'Could not import the product.',
        });
    } finally {
        setImportingIds(prev => prev.filter(id => id !== product.id));
    }
  }


  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Import from Supplier</h1>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search CJ Dropshipping</CardTitle>
          <CardDescription>Find products to import directly into your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 'leather wallet' or 'ceramic mugs'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
              disabled={isSearching}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="sr-only sm:not-sr-only sm:ml-2">Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {isSearching && (
            <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                <p className="mt-2 text-muted-foreground">Searching for products...</p>
            </div>
        )}
        {searchResults.map((product) => {
            const isImporting = importingIds.includes(product.id);
            return (
                <Card key={product.id}>
                    <CardContent className="p-4 flex flex-col md:flex-row gap-6">
                        <Image 
                            src={product.imageUrl}
                            alt={product.title}
                            width={150}
                            height={150}
                            className="rounded-md object-cover aspect-square bg-muted"
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{product.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{product.description}</p>
                             <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">{product.category}</Badge>
                                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <Button onClick={() => handleImport(product)} disabled={isImporting}>
                                {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                {isImporting ? 'Importing...' : 'Import'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
         {!isSearching && searchResults.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Search results from CJ Dropshipping will appear here.</p>
            </div>
        )}
      </div>

    </main>
  );
}
