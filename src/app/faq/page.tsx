import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all items in their original condition. Please visit our Shipping & Returns page for more details on how to initiate a return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days within the US. International shipping times vary by destination. You can find more specific information on our Shipping & Returns page."
    },
    {
      question: "Are your products ethically sourced?",
      answer: "Yes, we are committed to ethical sourcing. We work directly with artisans and small businesses to ensure fair labor practices and sustainable material sourcing. You can read more about our mission on our About Us page."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and times will be calculated at checkout based on your location."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order has shipped, you will receive an email with a tracking number and a link to track your package."
    },
    {
      question: "Can I cancel or change my order?",
      answer: "If you need to make changes to your order, please contact us as soon as possible. We can't guarantee changes can be made once an order is processed, but we will do our best to accommodate your request."
    }
  ]
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
