
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { placeOrderAction } from './actions';
import { toast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cartItems, total } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zip: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        shippingAddress: {
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
        },
        cartItems: cartItems.map(item => ({
            productId: item.product.id,
            variantId: item.variation?.id,
            sku: item.variation?.sku,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price + (item.variation?.priceModifier || 0),
        })),
        total,
    };

    try {
        const result = await placeOrderAction(orderData);
        if (result.success) {
             router.push('/storefront/thank-you');
        } else {
            toast({
                variant: 'destructive',
                title: 'Order Failed',
                description: result.error || 'There was a problem placing your order.',
            });
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Order Failed',
            description: 'An unexpected error occurred. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handlePlaceOrder}>
            <Card>
              <CardHeader>
                <CardTitle>Contact & Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" value={formData.city} onChange={handleInputChange} required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="12345" value={formData.zip} onChange={handleInputChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="**** **** **** 1234" required />
                </div>
                 <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </CardContent>
            </Card>
             <Button type="submit" className="w-full mt-8" size="lg" disabled={isLoading || cartItems.length === 0}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Placing Order...' : 'Place Order'}
             </Button>
          </form>
        </div>
        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          {cartItems.length > 0 ? (
            <>
                <div className="space-y-4">
                    {cartItems.map((item, index) => (
                    <div key={`${item.product.id}-${item.variation?.id || index}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                        <Image src={item.product.image.src} alt={item.product.image.alt} width={64} height={64} className="rounded-md object-cover" />
                        <div>
                            <p className="font-medium">{item.product.name}</p>
                            {item.variation && (
                                <p className="text-sm text-muted-foreground">
                                    {item.variation.attributes.map(attr => attr.value).join(', ')}
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        </div>
                        <p className="font-medium">${((item.product.price + (item.variation?.priceModifier || 0)) * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping</p>
                        <p>Free</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <p>Total</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                </div>
            </>
          ) : (
             <div className="text-center text-muted-foreground py-12">
                Your cart is empty.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
