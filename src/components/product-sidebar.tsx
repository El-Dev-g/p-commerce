
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProductSidebarProps {
  categories: string[];
  onSearchChange: (value: string) => void;
  onPriceChange: (value: number[]) => void;
  onCategoryChange: (value: string) => void;
  priceRange: number[];
  selectedCategory: string;
  useAiSearch: boolean;
  onAiSearchChange: (value: boolean) => void;
  isAiSearching: boolean;
}

export function ProductSidebar({
  categories,
  onSearchChange,
  onPriceChange,
  onCategoryChange,
  priceRange,
  selectedCategory,
  useAiSearch,
  onAiSearchChange,
  isAiSearching,
}: ProductSidebarProps) {
  return (
    <aside className="w-full md:w-64 lg:w-72">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="font-headline text-2xl font-semibold mb-4">Search</h3>
          <div className="relative">
            <Input
              placeholder="Search products..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-12"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={useAiSearch ? 'secondary' : 'ghost'}
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                    onClick={() => onAiSearchChange(!useAiSearch)}
                    disabled={isAiSearching}
                  >
                    {isAiSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle AI Search</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{useAiSearch ? 'Disable AI Search' : 'Enable AI Search'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <Select onValueChange={onCategoryChange} value={selectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}
