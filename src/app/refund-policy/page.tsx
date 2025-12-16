import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="prose prose-lg mx-auto max-w-4xl dark:prose-invert">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Refund Policy
            </h1>
            <p className="lead text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2 className="mt-12 font-headline text-3xl font-semibold">Our Promise</h2>
            <p>
              We want you to be completely satisfied with your purchase from Curated Finds. If you are not happy with your order for any reason, we are here to help. Our refund policy is designed to be simple and fair.
            </p>
            
            <h3 className="mt-8">Eligibility for a Refund</h3>
            <p>
              To be eligible for a refund, please ensure that:
            </p>
            <ul>
                <li>You have initiated the return within 30 days of receiving your item.</li>
                <li>The item is in its original, unused condition, with all original packaging and tags intact.</li>
                <li>Custom or personalized items are generally not eligible for refunds unless they arrive damaged or defective.</li>
            </ul>

            <h2 className="mt-12 font-headline text-3xl font-semibold">How to Request a Refund</h2>
            <p>
                To start the refund process, please contact our customer support team at <a href="mailto:hello@curatedfinds.com">hello@curatedfinds.com</a>. Provide your order number and a brief explanation of why you are requesting a refund. Our team will guide you through the return shipping process.
            </p>

            <h3 className="mt-8">Refund Processing</h3>
            <p>
                Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
            </p>

            <h2 className="mt-12 font-headline text-3xl font-semibold">Damaged or Incorrect Items</h2>
            <p>
              If you receive a damaged, defective, or incorrect item, please contact us immediately. We will arrange for a replacement or a full refund, including any shipping costs.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
