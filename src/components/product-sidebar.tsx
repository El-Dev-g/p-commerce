
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface ProductSidebarProps {
  categories: string[];
  onSearchChange: (value: string) => void;
  onPriceChange: (value: number[]) => void;
  onCategoryChange: (value: string) => void;
  priceRange: number[];
  selectedCategory: string;
}

export function ProductSidebar({
  categories,
  onSearchChange,
  onPriceChange,
  onCategoryChange,
  priceRange,
  selectedCategory,
}: ProductSidebarProps) {
  return (
    <aside className="w-full md:w-64 lg:w-72">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="font-headline text-2xl font-semibold mb-4">Search</h3>
          <Input
            placeholder="Search products..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Separator />

        <div>
          <h3 className="font-headline text-2xl font-semibold mb-4">
            Filter by Price
          </h3>
          <div className="space-y-4">
            <Slider
              min={0}
              max={150}
              step={5}
              value={priceRange}
              onValueChange={onPriceChange}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-headline text-2xl font-semibold mb-4">
            Categories
          </h3>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={category} />
                <Label htmlFor={category}>{category}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </aside>
  );
}
