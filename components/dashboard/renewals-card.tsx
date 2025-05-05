'use client';

import { format } from 'date-fns';
import { Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Expense } from '@/lib/types';

interface RenewalsCardProps {
  renewals: Expense[];
}

export function RenewalsCard({ renewals }: RenewalsCardProps) {
  // Function to determine the urgency of a renewal
  function getRenewalUrgency(date: Date): 'low' | 'medium' | 'high' {
    const daysUntil = Math.floor(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntil <= 3) return 'high';
    if (daysUntil <= 7) return 'medium';
    return 'low';
  }

  // Function to get the appropriate CSS class based on urgency
  function getUrgencyClass(urgency: 'low' | 'medium' | 'high'): string {
    switch (urgency) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-orange-500 dark:text-orange-400';
      default:
        return 'text-muted-foreground';
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Upcoming Renewals</CardTitle>
          <CardDescription>Next 30 days</CardDescription>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="max-h-[240px] overflow-auto">
        {renewals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming renewals in the next 30 days.</p>
        ) : (
          <div className="space-y-3">
            {renewals.map((renewal) => {
              const urgency = getRenewalUrgency(renewal.nextRenewal as Date);
              return (
                <div
                  key={renewal.id}
                  className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{renewal.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {renewal.description}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-3.5 w-3.5" />
                      <span className="font-medium">
                        {renewal.amount} {renewal.currency}
                      </span>
                    </div>
                    <span className={cn('text-xs', getUrgencyClass(urgency))}>
                      {format(renewal.nextRenewal as Date, 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}