
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Control } from 'react-hook-form';
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
import { Sparkles, Loader2, Trash2, PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const variationSchema = z.object({
  id: z.string().optional(),
  attributes: z.array(z.object({ name: z.string().min(1, 'Attribute name cannot be empty'), value: z.string().min(1, 'Attribute value cannot be empty') })).min(1),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  priceModifier: z.coerce.number().default(0),
});

const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Please select a category." }),
  image: z.object({
    src: z.string().url(),
    alt: z.string(),
  }).optional(),
  variations: z.array(variationSchema).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

function VariationAttributes({ control, variationIndex }: { control: Control<ProductFormData>, variationIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variations.${variationIndex}.attributes`,
  });

  return (
    <div className="space-y-3">
      {fields.map((field, attrIndex) => (
        <div key={field.id} className="grid grid-cols-11 gap-2 items-center">
          <div className="col-span-5">
            <Label className="sr-only">Attribute Name</Label>
            <Input {...control.register(`variations.${variationIndex}.attributes.${attrIndex}.name`)} placeholder="e.g. Color" />
          </div>
          <div className="col-span-5">
            <Label className="sr-only">Attribute Value</Label>
            <Input {...control.register(`variations.${variationIndex}.attributes.${attrIndex}.value`)} placeholder="e.g. Blue" />
          </div>
          <Button type="button" variant="ghost" size="icon" className="col-span-1 text-destructive" onClick={() => remove(attrIndex)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', value: '' })}>
        <PlusCircle className="mr-2 h-4 w-4" />Add Attribute
      </Button>
    </div>
  );
}

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
      ...product,
      variations: product.variations || [],
    } : {
      name: '',
      description: '',
      price: 0,
      category: '',
      variations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variations",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Fill out the information for your new product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 28.00" {...field} />
                        </FormControl>
                         <FormDescription>This is the base price. Variations can modify this.</FormDescription>
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
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Inventory &amp; Variations</CardTitle>
              <CardDescription>Manage product variations, SKUs, and stock.</CardDescription>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md mb-4 space-y-4 relative">
                  <h4 className="font-semibold">Variation #{index + 1}</h4>
                  
                  <VariationAttributes control={form.control} variationIndex={index} />

                  <Separator />

                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`variations.${index}.sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. MUG-BLU-LG" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`variations.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 50" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`variations.${index}.priceModifier`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Modifier</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 5 or -2.5" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ attributes: [{ name: '', value: '' }], sku: '', stock: 0, priceModifier: 0 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Variation
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <div className="space-y-8 sticky top-8">
            <Card>
                <CardHeader>
                    <CardTitle>Save Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button type="submit" disabled={isSaving} className="w-full">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Product'}
                    </Button>
                </CardContent>
            </Card>
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
      </form>
    </Form>
  );
}
