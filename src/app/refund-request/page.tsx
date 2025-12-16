
'use client';

import { useState } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RefundRequestPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // In a real app, you would send this data to your backend.
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Refund Request Submitted:', data);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);

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
                disabled={isLoading}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email address used for the order"
                className="bg-background"
                required
                disabled={isLoading}
              />
              <Textarea
                name="reason"
                placeholder="Reason for your refund request..."
                rows={6}
                className="bg-background"
                required
                disabled={isLoading}
              />
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
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
