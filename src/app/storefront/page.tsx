
'use server';

import fs from 'fs/promises';
import path from 'path';
import StorefrontPageClient from './storefront-client-page';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { products as allProducts } from '@/lib/products';

async function getHomepageSections() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'homepage-sections.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.sections;
  } catch (error) {
    console.error("Could not read homepage-sections.json:", error);
    // Fallback to default sections if file is missing or invalid
    return [
        { id: 'hero', type: 'hero' },
        { id: 'featured-products', type: 'featured-collection' },
    ];
  }
}


const getFeaturedProducts = () => {
    return allProducts.slice(0, 4);
};

const getHeroImage = () => {
    const image = PlaceHolderImages.find(img => img.id === 'hero-watch');
    if (!image) {
        return {
            src: 'https://picsum.photos/seed/storefront-hero/1200/800',
            alt: 'Hero Image',
            'data-ai-hint': 'elegant storefront display'
        }
    }
    return {
        src: image.imageUrl,
        alt: image.description,
        'data-ai-hint': image.imageHint,
    }
}


export default async function StorefrontPage() {
    const sections = await getHomepageSections();
    const featuredProducts: Product[] = getFeaturedProducts();
    const heroImage = getHeroImage();

    return (
        <StorefrontPageClient 
            initialSections={sections} 
            featuredProducts={featuredProducts} 
            heroImage={heroImage} 
        />
    );
}

