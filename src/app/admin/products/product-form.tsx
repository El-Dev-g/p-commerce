
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '@/lib/types';
import { categories } from '@/lib/products';
import { generateProductDescription } from '@/ai/flows/generate-product-descriptions';
import { generateProductTitles } from '@/ai/flows/generate-product-titles';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  image: z.object({
    src: z.string().url(),
    alt: z.string(),
  }).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [isDescLoading, setIsDescLoading] = useState(false);
  const [isTitleLoading, setIsTitleLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
    } : {
      name: '',
      description: '',
      price: 0,
      category: '',
    },
  });

  const handleGenerateDescription = async () => {
    const productName = form.getValues('name');
    if (!productName || !keywords) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a product name and some keywords to generate a description.',
      });
      return;
    }
    setIsDescLoading(true);
    try {
      const result = await generateProductDescription({
        productName,
        keywords: keywords.split(',').map(k => k.trim()),
      });
      form.setValue('description', result.description);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to generate product description.',
      });
    } finally {
      setIsDescLoading(false);
    }
  };
  
  const handleGenerateTitles = async () => {
    const description = form.getValues('description');
    const category = form.getValues('category');
    if (!description || !category) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a description and category to generate titles.',
      });
      return;
    }
    setIsTitleLoading(true);
    try {
      const result = await generateProductTitles({ description, category });
      setSuggestedTitles(result.titles);
    } catch (error) {
      console.error(error);
       toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to generate product titles.',
      });
    } finally {
      setIsTitleLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    console.log('Form submitted:', data);
    // Here you would typically call an API to save the product
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    toast({
      title: 'Product Saved',
      description: `${data.name} has been successfully saved.`,
    });
    
    setIsSaving(false);
    router.push('/admin/products');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill out the information for your new product.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Artisan Ceramic Mug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the product..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 28.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Product'}
                 </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Content Tools
                </div>
            </CardTitle>
            <CardDescription>
              Use AI to help you write compelling content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Generate Description</Label>
              <Input
                placeholder="Enter keywords (e.g. handmade, rustic)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGenerateDescription}
                disabled={isDescLoading}
              >
                {isDescLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Suggest Titles</Label>
               <Button
                variant="outline"
                className="w-full"
                onClick={handleGenerateTitles}
                disabled={isTitleLoading}
              >
                {isTitleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Titles
              </Button>
               {suggestedTitles.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Click a title to use it:</p>
                    <div className="flex flex-col gap-2">
                    {suggestedTitles.map((title, index) => (
                        <Button
                        key={index}
                        variant="link"
                        className="p-0 h-auto justify-start text-left"
                        onClick={() => form.setValue('name', title)}
                        >
                        {title}
                        </Button>
                    ))}
                    </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
