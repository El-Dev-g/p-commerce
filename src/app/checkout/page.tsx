'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

const formSchema = z
  .object({
    firstName: z.string().min(2, { message: 'First name is required.' }),
    lastName: z.string().min(2, { message: 'Last name is required.' }),
    address: z.string().min(5, { message: 'Address is required.' }),
    city: z.string().min(2, { message: 'City is required.' }),
    state: z.string().min(2, { message: 'State is required.' }),
    zip: z.string().min(5, { message: 'ZIP code is required.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    paymentMethod: z.enum(['card', 'bank'], {
      required_error: 'You need to select a payment method.',
    }),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvc: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === 'card') {
        return (
          !!data.cardNumber?.match(/^\d{16}$/) &&
          !!data.expiryDate?.match(/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/) &&
          !!data.cvc?.match(/^\d{3,4}$/)
        );
      }
      return true;
    },
    {
      message: 'Please fill in all credit card details.',
      path: ['cardNumber'], // You can associate the error with a specific field if you want
    }
  )
    .refine(
    (data) => {
      if (data.paymentMethod === 'card' && !data.cardNumber?.match(/^\d{16}$/)) {
        return false;
      }
      return true;
    },
    {
      message: 'Invalid card number',
      path: ['cardNumber'],
    }
  )
   .refine(
    (data) => {
      if (data.paymentMethod === 'card' && !data.expiryDate?.match(/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/)) {
        return false;
      }
      return true;
    },
    {
      message: 'Invalid expiry date (MM / YY)',
      path: ['expiryDate'],
    }
  )
   .refine(
    (data) => {
      if (data.paymentMethod === 'card' && !data.cvc?.match(/^\d{3,4}$/)) {
        return false;
      }
      return true;
    },
    {
      message: 'Invalid CVC',
      path: ['cvc'],
    }
  )
  .refine(
    (data) => {
      if (data.paymentMethod === 'bank') {
        return (
          !!data.accountHolderName &&
          data.accountHolderName.length > 2 &&
          !!data.accountNumber &&
          data.accountNumber.length > 5 &&
          !!data.routingNumber &&
          data.routingNumber.length > 5
        );
      }
      return true;
    },
    {
      message: 'Please fill in all bank transfer details.',
      path: ['accountHolderName'], // Associate error with the first field in the group
    }
  );

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      email: '',
      phone: '',
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      accountHolderName: '',
      accountNumber: '',
      routingNumber: '',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const order = {
      id: `ord_${new Date().getTime()}`,
      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
      },
      items: cartItems,
      total: getCartTotal(),
      orderDate: new Date().toISOString(),
      paymentMethod: values.paymentMethod,
      trackingNumber: '1Z999AA10123456789', // Simulated tracking number
      carrier: 'UPS', // Simulated carrier
    };

    // In a real app, you would process payment here.
    console.log('Processing payment...');

    // After successful payment, forward the order to the dropshipping supplier.
    try {
      const response = await fetch('/api/v1/forward-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to forward order to supplier');
      }

      console.log('Order forwarded to supplier successfully');
    } catch (error) {
      console.error(error);
      // Optionally, handle the error in the UI
    }

    // And send a WhatsApp confirmation
    try {
      await fetch('/api/v1/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.customer.phone,
          type: 'order_confirmation',
          orderId: order.id,
          customerName: order.customer.firstName,
        }),
      });
      console.log('WhatsApp confirmation triggered successfully');
    } catch (error) {
      console.error('Failed to trigger WhatsApp message', error);
    }

    // For this prototype, we'll store the order in localStorage.
    localStorage.setItem('lastOrder', JSON.stringify(order));

    clearCart();
    router.push('/order-confirmation');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Checkout
            </h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2"
            >
              <div className="space-y-8">
                <div>
                  <h2 className="font-headline text-2xl font-semibold">
                    Shipping Information
                  </h2>
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Artisan Way" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Handcrafted City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="45678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(123) 456-7890"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="font-headline text-2xl font-semibold">
                    Payment Details
                  </h2>
                  <div className="mt-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="card" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Credit Card
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="bank" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Bank Transfer
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {paymentMethod === 'card' && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="**** **** **** 1234"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM / YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVC</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="accountHolderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Holder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="123456789" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="routingNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Routing Number</FormLabel>
                              <FormControl>
                                <Input placeholder="111000025" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                              <Image
                                src={item.product.image.src}
                                alt={item.product.image.alt}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Your cart is empty.
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>${getCartTotal().toFixed(2)}</p>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={
                        cartItems.length === 0 || form.formState.isSubmitting
                      }
                    >
                      {form.formState.isSubmitting
                        ? 'Placing Order...'
                        : 'Place Order'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
