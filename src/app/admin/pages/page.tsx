
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function PagesManagementPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Manage Pages</h1>
        <Button>Save All Changes</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
          <CardDescription>
            Edit the content for the public-facing pages of your storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['about-us']} className="w-full">
            <AccordionItem value="about-us">
              <AccordionTrigger className="text-lg font-semibold">About Us</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="about-mission" className="text-base">Our Mission</Label>
                  <Textarea
                    id="about-mission"
                    placeholder="Describe your company's mission..."
                    defaultValue="To bring thoughtfully curated, high-quality goods to customers who appreciate authenticity and craftsmanship. We believe in products with a story."
                    className="min-h-[120px]"
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="about-story" className="text-base">Our Story</Label>
                  <Textarea
                    id="about-story"
                    placeholder="Tell your company's story..."
                    defaultValue="Founded in a small workshop with a big dream, Curated Finds has grown from a passion project into a beloved brand. Our journey is one of dedication to quality and a deep respect for the artisans we work with. We travel the world to find unique items that you won't find anywhere else."
                    className="min-h-[200px]"
                  />
                </div>
                <Button variant="outline">Save About Us</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="contact-us">
              <AccordionTrigger className="text-lg font-semibold">Contact Us</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-intro" className="text-base">Introductory Text</Label>
                  <Textarea
                    id="contact-intro"
                    placeholder="Enter the text for your contact page..."
                    defaultValue="We'd love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to say hello, feel free to reach out."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input id="contact-email" defaultValue="support@curatedfinds.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-phone">Phone Number</Label>
                        <Input id="contact-phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                </div>
                <Button variant="outline">Save Contact Us</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy-policy">
              <AccordionTrigger className="text-lg font-semibold">Privacy Policy</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <Textarea
                  placeholder="Enter your privacy policy text here..."
                  className="min-h-[400px]"
                  defaultValue="Your privacy is important to us. It is Curated Finds' policy to respect your privacy regarding any information we may collect from you across our website... (Full text would go here)"
                />
                <Button variant="outline">Save Privacy Policy</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="terms-of-service">
              <AccordionTrigger className="text-lg font-semibold">Terms of Service</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <Textarea
                  placeholder="Enter your terms of service text here..."
                  className="min-h-[400px]"
                  defaultValue="By accessing the website at https://curatedfinds.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations... (Full text would go here)"
                />
                <Button variant="outline">Save Terms of Service</Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
