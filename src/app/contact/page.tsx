import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
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

            <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input placeholder="First Name" className="bg-background" />
                    <Input placeholder="Last Name" className="bg-background" />
                </div>
              <Input type="email" placeholder="Email" className="bg-background" />
              <Input placeholder="Subject" className="bg-background" />
              <Textarea placeholder="Your message" rows={6} className="bg-background" />
              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
