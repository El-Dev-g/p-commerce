
'use client';

import { useCart } from '@/context/cart-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cartItems, total } = useCart();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically integrate with a payment provider like Stripe
    // and then call your API to create the order.
    console.log("Placing order with items:", cartItems);
    alert("Thank you for your order! (This is a simulation)");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handlePlaceOrder}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="12345" required />
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
             <Button type="submit" className="w-full mt-8" size="lg">Place Order</Button>
          </form>
        </div>
        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image src={item.product.image.src} alt={item.product.image.alt} width={64} height={64} className="rounded-md object-cover" />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
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
        </div>
      </div>
    </div>
  );
}
