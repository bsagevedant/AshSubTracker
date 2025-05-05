'use client';

import { format } from 'date-fns';
import { CalendarClock, CreditCard, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Expense, ExpenseCategory } from '@/lib/types';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    development: 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300',
    ai: 'bg-purple-500/20 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300',
    domains: 'bg-orange-500/20 text-orange-700 dark:bg-orange-500/30 dark:text-orange-300',
    design: 'bg-pink-500/20 text-pink-700 dark:bg-pink-500/30 dark:text-pink-300',
    marketing: 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300',
    other: 'bg-gray-500/20 text-gray-700 dark:bg-gray-500/30 dark:text-gray-300',
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {expense.name}
              {!expense.active && (
                <Badge variant="outline" className="ml-1">
                  Inactive
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{expense.description}</CardDescription>
          </div>
          <div>
            <Badge variant="secondary" className={CATEGORY_COLORS[expense.category]}>
              {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Amount</div>
            <div className="font-medium">
              {expense.currency} {expense.amount.toFixed(2)}
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Type</div>
            <div className="flex items-center">
              {expense.type === 'recurring' ? (
                <>
                  <CalendarClock className="mr-1 h-3.5 w-3.5" />
                  <span>
                    {expense.billingCycle?.charAt(0).toUpperCase()}
                    {expense.billingCycle?.slice(1)}
                  </span>
                </>
              ) : (
                <>
                  <CreditCard className="mr-1 h-3.5 w-3.5" />
                  <span>One-time</span>
                </>
              )}
            </div>
          </div>
          
          {expense.type === 'recurring' && expense.nextRenewal && (
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">Next Renewal</div>
              <div>{format(new Date(expense.nextRenewal), 'MMM d, yyyy')}</div>
            </div>
          )}
          
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Started</div>
            <div>{format(new Date(expense.startDate), 'MMM d, yyyy')}</div>
          </div>
          
          {expense.notes && (
            <div className="mt-2 text-sm">
              <div className="font-medium">Notes:</div>
              <div className="text-muted-foreground">{expense.notes}</div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/40 px-6 py-3">
        <div className="flex items-center gap-1">
          <div className="text-sm text-muted-foreground">Usefulness:</div>
          <div className="font-medium">{expense.usefulness}/10</div>
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(expense)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Expense</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Expense</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}