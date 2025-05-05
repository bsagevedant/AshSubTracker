'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Expense, ExpenseCategory } from '@/lib/types';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  currency: z.string().default('USD'),
  category: z.enum(['development', 'ai', 'domains', 'design', 'marketing', 'other']),
  type: z.enum(['recurring', 'one-time']),
  billingCycle: z.enum(['monthly', 'quarterly', 'yearly', 'custom']).optional(),
  nextRenewal: z.date().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  usefulness: z.number().min(1).max(10).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [isRecurring, setIsRecurring] = useState(
    expense ? expense.type === 'recurring' : true
  );
  
  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: expense
      ? {
          ...expense,
          amount: expense.amount,
          nextRenewal: expense.nextRenewal ? new Date(expense.nextRenewal) : undefined,
          startDate: new Date(expense.startDate),
          endDate: expense.endDate ? new Date(expense.endDate) : undefined,
        }
      : {
          name: '',
          description: '',
          amount: 0,
          currency: 'USD',
          category: 'development',
          type: 'recurring',
          billingCycle: 'monthly',
          startDate: new Date(),
          usefulness: 5,
        },
  });
  
  // Handle type change
  const handleTypeChange = (value: 'recurring' | 'one-time') => {
    setIsRecurring(value === 'recurring');
    if (value === 'one-time') {
      form.setValue('billingCycle', undefined);
      form.setValue('nextRenewal', undefined);
    } else {
      form.setValue('billingCycle', 'monthly');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vercel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="ai">AI & APIs</SelectItem>
                        <SelectItem value="domains">Domains & Infra</SelectItem>
                        <SelectItem value="design">Design & Content</SelectItem>
                        <SelectItem value="marketing">Marketing & Analytics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this expense"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTypeChange(value as 'recurring' | 'one-time');
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="recurring" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Recurring
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="one-time" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          One-time
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isRecurring && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Cycle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nextRenewal"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Next Renewal Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isRecurring && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes or details"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="usefulness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usefulness Rating (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value || 5]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not useful</span>
                        <span>Very useful</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Rate how useful this expense is to your workflow
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                <CheckCircle className="mr-2 h-4 w-4" />
                {expense ? 'Update' : 'Create'} Expense
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}