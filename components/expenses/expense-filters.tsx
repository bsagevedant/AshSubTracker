'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExpenseCategory } from '@/lib/types';

interface ExpenseFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategories: ExpenseCategory[];
  setSelectedCategories: (categories: ExpenseCategory[]) => void;
  showActive: boolean;
  setShowActive: (value: boolean) => void;
}

export function ExpenseFilters({
  search,
  setSearch,
  selectedCategories,
  setSelectedCategories,
  showActive,
  setShowActive,
}: ExpenseFiltersProps) {
  const categories: { value: ExpenseCategory; label: string }[] = [
    { value: 'development', label: 'Development' },
    { value: 'ai', label: 'AI & APIs' },
    { value: 'domains', label: 'Domains & Infra' },
    { value: 'design', label: 'Design & Content' },
    { value: 'marketing', label: 'Marketing & Analytics' },
    { value: 'other', label: 'Other' },
  ];

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => handleCategoryToggle(category.value)}
              >
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showActive}
              onCheckedChange={setShowActive}
            >
              Show Active Only
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}