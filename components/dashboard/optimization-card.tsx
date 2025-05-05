'use client';

import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense } from '@/lib/types';

interface OptimizationCardProps {
  optimizations: { expense: Expense; suggestion: string }[];
}

export function OptimizationCard({ optimizations }: OptimizationCardProps) {
  const CATEGORY_BADGES: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    development: { label: 'Dev', variant: 'secondary' },
    ai: { label: 'AI', variant: 'default' },
    domains: { label: 'Domain', variant: 'outline' },
    design: { label: 'Design', variant: 'secondary' },
    marketing: { label: 'Marketing', variant: 'default' },
    other: { label: 'Other', variant: 'outline' },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Optimization Tips</CardTitle>
          <CardDescription>Save money on your subscriptions</CardDescription>
        </div>
        <Sparkles className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="max-h-[240px] overflow-auto">
        {optimizations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No optimization suggestions available.</p>
        ) : (
          <div className="space-y-3">
            {optimizations.map((item, index) => {
              const categoryConfig = CATEGORY_BADGES[item.expense.category] || CATEGORY_BADGES.other;
              
              return (
                <div
                  key={`${item.expense.id}-${index}`}
                  className="rounded-md border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{item.expense.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${item.expense.amount}
                      </span>
                      <Badge variant={categoryConfig.variant} className="text-xs">
                        {categoryConfig.label}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}