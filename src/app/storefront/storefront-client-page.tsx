
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Helper function to render a section based on its type
const renderSection = (section: { type: string; id: string }, products: Product[], heroImage: any) => {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} heroImage={heroImage} />;
    case 'featured-collection':
      return <FeaturedProductsSection key={section.id} products={products} />;
    case 'newsletter':
        return <NewsletterSection key={section.id} />;
    case 'testimonials':
        return <TestimonialsSection key={section.id} />;
    case 'rich-text':
        return <RichTextSection key={section.id} />;
    case 'image-with-text':
        return <ImageWithTextSection key={section.id} />;
    case 'gallery':
        return <GallerySection key={section.id} />;
    case 'video':
        return <VideoSection key={section.id} />;
    case 'header-banner':
        // The banner is handled by the StorefrontHeader component now
        return null;
    default:
      return (
        <div key={section.id} className="container mx-auto py-12 text-center">
          <p className="text-red-500">Unknown section type: {section.type}</p>
        </div>
      );
  }
};


type StorefrontPageClientProps = {
    initialSections: { id: string; type: string }[];
    featuredProducts: Product[];
    heroImage: any;
}

export default function StorefrontPageClient({ 
    initialSections, 
    featuredProducts, 
    heroImage,
}: StorefrontPageClientProps) {
    
    const [sections, setSections] = useState(initialSections);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'UPDATE_SECTIONS') {
                setSections(event.data.sections);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // The banner is rendered in the header, filter it out from the main content
    const contentSections = sections.filter(s => s.type !== 'header-banner');

    return (
        <>
            {contentSections.map(section => renderSection(section, featuredProducts, heroImage))}
        </>
    );
}

function HeroSection({ heroImage }: { heroImage: any }) {
    return (
        <section className="py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <Image
                        src={heroImage.src}
                        alt={heroImage.alt}
                        width={1200}
                        height={800}
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                        data-ai-hint={heroImage['data-ai-hint']}
                    />
                    <div className="flex flex-col justify-center space-y-4">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Discover Our Collection</h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                            Explore a world of hand-picked items that blend quality craftsmanship with timeless design.
                        </p>
                        <Link href="/storefront/catalog" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-fit">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturedProductsSection({ products }: { products: Product[] }) {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container mx-auto grid items-center justify-center gap-8 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Products</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                        Check out some of our favorite and most popular items.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map(product => (
                        <Card key={product.id}>
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
                 <div className="flex justify-center">
                    <Button asChild variant="outline">
                        <Link href="/storefront/catalog">View All Products</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function NewsletterSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Stay in the Loop</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                        Subscribe to our newsletter to get the latest updates on new arrivals, special offers, and more.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <form className="flex space-x-2">
                        <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                        <Button type="submit">Subscribe</Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="grid gap-10 sm:gap-16">
                    <div className="flex flex-col items-center justify-center text-center">
                         <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Customers Say</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Hear from our community of happy shoppers.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground">"The quality is outstanding. I've never owned a journal this beautiful. You can feel the craftsmanship."</p>
                            </CardContent>
                             <CardHeader className="p-6 pt-0 flex-row items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="https://i.pravatar.cc/150?img=11" alt="Jane Doe" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base">Jane Doe</CardTitle>
                                    <p className="text-sm text-muted-foreground">Verified Buyer</p>
                                </div>
                            </CardHeader>
                        </Card>
                         <Card>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground">"Fast shipping and the scarf was even cozier than I imagined. I'll definitely be back for more."</p>
                            </CardContent>
                            <CardHeader className="p-6 pt-0 flex-row items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="John Smith" />
                                    <AvatarFallback>JS</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base">John Smith</CardTitle>
                                    <p className="text-sm text-muted-foreground">Verified Buyer</p>
                                </div>
                            </CardHeader>
                        </Card>
                         <Card>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground">"I bought the compass as a gift and it was a huge hit. The packaging was beautiful too. Great attention to detail."</p>
                            </CardContent>
                             <CardHeader className="p-6 pt-0 flex-row items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="https://i.pravatar.cc/150?img=14" alt="Emily White" />
                                    <AvatarFallback>EW</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base">Emily White</CardTitle>
                                    <p className="text-sm text-muted-foreground">Verified Buyer</p>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

function RichTextSection() {
    return (
        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Commitment to Quality</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Every item in our collection is selected with an eye for detail, a passion for craftsmanship, and a commitment to timeless style. We believe in products that are not just beautiful, but are made to last and tell a story for years to come.
                    </p>
                </div>
            </div>
        </section>
    );
}

function ImageWithTextSection() {
    return (
        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                    <Image
                        src="https://picsum.photos/seed/iw-1/800/600"
                        alt="Descriptive image"
                        width={800}
                        height={600}
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                        data-ai-hint="product lifestyle"
                    />
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Crafted for Life</h2>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                           Our products are designed not just to be used, but to be lived with. Each piece is a blend of functionality and artistry, made to become a cherished part of your daily routine.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/storefront/catalog">Explore the Collection</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function GallerySection() {
    const images = [
        { src: "https://picsum.photos/seed/gal-1/600/800", alt: "Gallery image 1", hint: "artisan product" },
        { src: "https://picsum.photos/seed/gal-2/600/800", alt: "Gallery image 2", hint: "lifestyle detail" },
        { src: "https://picsum.photos/seed/gal-3/600/800", alt: "Gallery image 3", hint: "material texture" },
    ];
    return (
        <section className="w-full py-12 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="space-y-3 text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Visual Stories</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">A glimpse into the world of p-commerce.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <Image
                            key={index}
                            src={img.src}
                            alt={img.alt}
                            width={600}
                            height={800}
                            className="rounded-lg object-cover w-full aspect-[3/4]"
                            data-ai-hint={img.hint}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function VideoSection() {
    return (
        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">The Making Of</h2>
                    <p className="mt-2 text-muted-foreground md:text-xl">See the care and craftsmanship that goes into our collection.</p>
                </div>
                <div className="aspect-video w-full max-w-4xl mx-auto">
                    <iframe
                        className="w-full h-full rounded-lg"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </section>
    );
}
