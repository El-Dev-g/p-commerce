
'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function RefundRequestPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would send this data to your backend.
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Refund Request Submitted:', data);

    toast({
      title: 'Request Submitted',
      description:
        'Your refund request has been received. We will get back to you within 1-2 business days.',
    });

    // Redirect to the home page after submission
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
                Request a Refund
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Fill out the form below to request a refund. Please refer to
                our refund policy for eligibility.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <Input
                name="orderId"
                placeholder="Order ID (e.g., ord_123456789)"
                className="bg-background"
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email address used for the order"
                className="bg-background"
                required
              />
              <Textarea
                name="reason"
                placeholder="Reason for your refund request..."
                rows={6}
                className="bg-background"
                required
              />
              <Button type="submit" size="lg" className="w-full">
                Submit Request
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
