
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, ShoppingCart, Users } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { products } from '@/lib/products';

const revenueData = [
    { date: "2024-07-01", revenue: 1200 },
    { date: "2024-07-02", revenue: 1500 },
    { date: "2024-07-03", revenue: 1300 },
    { date: "2024-07-04", revenue: 1800 },
    { date: "2024-07-05", revenue: 1700 },
    { date: "2024-07-06", revenue: 2100 },
    { date: "2024-07-07", revenue: 2000 },
    { date: "2024-07-08", revenue: 2200 },
    { date: "2024-07-09", revenue: 2500 },
    { date: "2024-07-10", revenue: 2300 },
    { date: "2024-07-11", revenue: 2700 },
    { date: "2024-07-12", revenue: 2600 },
    { date: "2024-07-13", revenue: 3000 },
    { date: "2024-07-14", revenue: 2800 },
    { date: "2024-07-15", revenue: 3100 },
];

const trafficData = [
  { source: 'Direct', visitors: 450, fill: 'var(--color-direct)' },
  { source: 'Google', visitors: 290, fill: 'var(--color-google)' },
  { source: 'Social', visitors: 180, fill: 'var(--color-social)' },
  { source: 'Referral', visitors: 80, fill: 'var(--color-referral)' },
]

const topProductsData = [
  { ...products[2], unitsSold: 152 },
  { ...products[3], unitsSold: 121 },
  { ...products[1], unitsSold: 98 },
  { ...products[6], unitsSold: 74 },
  { ...products[8], unitsSold: 65 },
]

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  visitors: {
    label: "Visitors",
  },
  direct: {
    label: "Direct",
    color: "hsl(var(--chart-1))",
  },
  google: {
    label: "Google",
    color: "hsl(var(--chart-2))",
  },
  social: {
    label: "Social Media",
    color: "hsl(var(--chart-3))",
  },
  referral: {
    label: "Referral",
    color: "hsl(var(--chart-4))",
  },
};


export default function AnalyticsPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Reports & Insights</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitor to Purchase Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.50</div>
            <p className="text-xs text-muted-foreground">+$5.20 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Referrer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Google</div>
            <p className="text-xs text-muted-foreground">Up 12% in referred sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Revenue over the last 15 days.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                accessibilityLayer
                data={revenueData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent
                    labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                        });
                    }}
                    indicator="dot" 
                    />}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="var(--color-revenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-revenue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Breakdown of visitor traffic sources.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex pb-0">
             <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={trafficData} dataKey="visitors" nameKey="source" />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>The best-selling products this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProductsData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.unitsSold}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
    </main>
  );
}
