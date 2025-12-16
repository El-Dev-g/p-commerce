import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="prose prose-lg mx-auto max-w-4xl dark:prose-invert">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Privacy Policy
            </h1>
            <p className="lead text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p>
              Your privacy is important to us. It is Curated Finds' policy to respect your privacy regarding any information we may collect from you across our website.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            </p>
            <p>
              The types of information we may collect include your name, email address, shipping address, and payment information. We may also collect non-personal information, such as your IP address and browsing behavior, to improve our services.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to process your orders, provide customer support, and improve our website and services. We may also use your email address to send you promotional materials, which you can opt out of at any time.
            </p>

            <h2>3. Security</h2>
            <p>
              We take the security of your personal information seriously. We use commercially acceptable means to protect your information, but we cannot guarantee its absolute security.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
                Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
            </p>
            
            <h2>5. Changes to This Policy</h2>
            <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2>Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us at hello@curatedfinds.com.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
