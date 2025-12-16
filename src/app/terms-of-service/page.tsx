import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="prose prose-lg mx-auto max-w-4xl dark:prose-invert">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Terms of Service
            </h1>
            <p className="lead text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>1. Terms</h2>
            <p>
              By accessing this Website, accessible from curatedfinds.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on Curated Finds's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display;</li>
              <li>attempt to reverse engineer any software contained on Curated Finds's Website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p>
              This will let Curated Finds to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
              All the materials on Curated Finds’s Website are provided "as is". Curated Finds makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Curated Finds does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
            </p>

            <h2>4. Limitations</h2>
            <p>
              Curated Finds or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Curated Finds’s Website, even if Curated Finds or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
            </p>

            <h2>5. Governing Law</h2>
            <p>
              Any claim related to Curated Finds's Website shall be governed by the laws of the country without regards to its conflict of law provisions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
