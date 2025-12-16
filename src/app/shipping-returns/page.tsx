import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function ShippingReturnsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="prose prose-lg mx-auto max-w-4xl dark:prose-invert">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Shipping & Returns
            </h1>

            <h2 className="mt-12 font-headline text-3xl font-semibold">Shipping Information</h2>
            <p>
              We are excited to get your curated finds to you! We offer shipping worldwide. Shipping costs and delivery times are calculated at checkout based on your location and the items in your order.
            </p>
            <h3>Processing Time</h3>
            <p>
                Orders are typically processed and shipped within 1-3 business days. You will receive a shipping confirmation email with tracking information as soon as your order is on its way.
            </p>
            <h3>Shipping Rates & Delivery Estimates</h3>
            <ul>
                <li><strong>Standard Domestic (US):</strong> 5-7 business days</li>
                <li><strong>Express Domestic (US):</strong> 2-3 business days</li>
                <li><strong>Standard International:</strong> 7-21 business days (varies by destination)</li>
            </ul>
            <p>
              Please note that delivery times are estimates and may vary due to factors beyond our control, such as customs delays for international orders.
            </p>

            <h2 className="mt-16 font-headline text-3xl font-semibold">Return Policy</h2>
            <p>
              We want you to be completely happy with your purchase. If you are not satisfied for any reason, you may return your item(s) within 30 days of the delivery date for a full refund or exchange.
            </p>
            <h3>Conditions for Returns</h3>
            <ul>
                <li>Items must be in their original, unused condition.</li>
                <li>Items must be returned with all original packaging and tags.</li>
                <li>Custom or personalized items are not eligible for returns.</li>
            </ul>
            <h3>How to Initiate a Return</h3>
            <p>
                To start a return, please contact our customer service team at <a href="mailto:hello@curatedfinds.com">hello@curatedfinds.com</a> with your order number and the reason for your return. We will provide you with instructions on how to send your item(s) back to us.
            </p>
            <h3>Refunds</h3>
            <p>
                Once we receive and inspect your return, we will process your refund to the original method of payment. Please allow 5-10 business days for the refund to appear on your statement.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
