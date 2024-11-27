'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Toys',
  'Sports',
  'Beauty',
  'Automotive'
];

export default function ProductFilterForm({
  initialCategory,
  initialMinPrice,
  initialMaxPrice,
  initialSearch
}: {
  initialCategory?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialSearch?: string;
}) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory || '');
  const [minPrice, setMinPrice] = useState(initialMinPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice?.toString() || '');
  const [search, setSearch] = useState(initialSearch || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (search) params.append('search', search);
    
    // Always reset to first page when applying filters
    params.set('page', '1');

    // Navigate with new parameters
    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    router.push('/products');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-grow">
          <Input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select 
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Input 
            type="number" 
            placeholder="Min Price" 
            className="w-[120px]"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input 
            type="number" 
            placeholder="Max Price" 
            className="w-[120px]"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">Apply Filters</Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
}