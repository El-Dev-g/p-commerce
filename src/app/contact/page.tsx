'use client';

import { useState } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // In a real app, you'd send this data to a backend API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you shortly."
    });

    // Optionally reset the form
    (event.target as HTMLFormElement).reset();
  };


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question or a comment? We'd love to hear from you.
            </p>
          </div>

          <div className="mt-16 grid gap-16 md:grid-cols-2">
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold font-headline">Contact Information</h2>
                    <p className="mt-2 text-muted-foreground">Fill up the form and our Team will get back to you within 24 hours.</p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Phone className="h-6 w-6 text-primary" />
                        <span className="text-muted-foreground">+1 (123) 456-7890</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 text-primary" />
                        <span className="text-muted-foreground">hello@curatedfinds.com</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <MapPin className="h-6 w-6 text-primary" />
                        <span className="text-muted-foreground">123 Artisan Way, Handcrafted City, 45678</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input name="firstName" placeholder="First Name" className="bg-background" required />
                    <Input name="lastName" placeholder="Last Name" className="bg-background" required/>
                </div>
              <Input name="email" type="email" placeholder="Email" className="bg-background" required />
              <Input name="subject" placeholder="Subject" className="bg-background" required />
              <Textarea name="message" placeholder="Your message" rows={6} className="bg-background" required />
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
