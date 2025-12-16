
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              About Curated Finds
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We believe in the power of craftsmanship and the beauty of unique, handcrafted goods. Our mission is to connect you with talented artisans from around the world.
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-headline text-3xl font-semibold">Our Story</h2>
              <p className="text-muted-foreground">
                Curated Finds was born from a passion for travel and a deep appreciation for authentic, handmade products. We started by discovering incredible artisans in small villages and bustling markets, each with a unique story to tell through their work. We wanted to create a platform to share these stories and products with a global audience.
              </p>
              <p className="text-muted-foreground">
                Every item in our collection is carefully selected for its quality, craftsmanship, and the story behind it. We work directly with our artisan partners to ensure fair practices and to help preserve traditional skills.
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                    alt="Team working together"
                    className="h-full w-full object-cover"
                />
            </div>
          </div>
          
          <div className="mt-20 text-center">
             <h2 className="font-headline text-3xl font-bold tracking-tight">Meet the Team</h2>
             <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
              The passionate individuals behind Curated Finds.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-card">
                <CardHeader className="items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Jane Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-xl">Jane Doe</CardTitle>
                  <p className="text-primary/80">Founder & CEO</p>
                  <p className="mt-2 text-sm text-muted-foreground">Jane travels the world to find the most unique products and build relationships with our artisan partners.</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-gray-800 hover:text-black dark:hover:text-gray-300">
                      <Github className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="John Smith" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-xl">John Smith</CardTitle>
                  <p className="text-primary/80">Head of Curation</p>
                   <p className="mt-2 text-sm text-muted-foreground">John has an eye for detail and ensures every product meets our high standards of quality and design.</p>
                   <div className="mt-4 flex justify-center gap-4">
                    <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-gray-800 hover:text-black dark:hover:text-gray-300">
                      <Github className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://i.pravatar.cc/150?img=14" alt="Emily White" />
                    <AvatarFallback>EW</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-xl">Emily White</CardTitle>
                  <p className="text-primary/80">Community Manager</p>
                   <p className="mt-2 text-sm text-muted-foreground">Emily connects with our community, sharing the stories behind our products and artisans.</p>
                   <div className="mt-4 flex justify-center gap-4">
                    <Link href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-gray-800 hover:text-black dark:hover:text-gray-300">
                      <Github className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
