
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { getProducts as getAllProducts } from '@/lib/products';


async function getProducts() {
  const products = await getAllProducts();
  return products;
}


export default async function CatalogPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-8">Our Collection</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
                <Card key={product.id} className="flex flex-col">
                    <CardContent className="p-0">
                         <Link href={`/storefront/products/${product.id}`}>
                            <Image 
                                src={product.image.src} 
                                alt={product.image.alt}
                                width={400}
                                height={300}
                                className="h-auto w-full rounded-t-lg object-cover aspect-[4/3]"
                            />
                        </Link>
                    </CardContent>
                    <CardHeader className="p-4 flex-grow">
                         <Link href={`/storefront/products/${product.id}`}>
                            <CardTitle className="text-lg hover:underline">{product.name}</CardTitle>
                         </Link>
                        <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                    </CardHeader>
                    <div className="p-4 pt-0">
                        <AddToCartButton product={product} />
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
}
