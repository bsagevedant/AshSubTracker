'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyExpenseSummary, ExpenseCategory } from '@/lib/types';

interface ExpenseTrendProps {
  data: MonthlyExpenseSummary[];
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  development: 'hsl(var(--chart-1))',
  ai: 'hsl(var(--chart-2))',
  domains: 'hsl(var(--chart-3))',
  design: 'hsl(var(--chart-4))',
  marketing: 'hsl(var(--chart-5))',
  other: 'hsl(var(--muted-foreground))',
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  development: 'Development',
  ai: 'AI & APIs',
  domains: 'Domains & Infra',
  design: 'Design & Content',
  marketing: 'Marketing & Analytics',
  other: 'Other',
};

export function ExpenseTrend({ data }: ExpenseTrendProps) {
  // Create a consistent order for categories to stack
  const categories: ExpenseCategory[] = [
    'development',
    'ai',
    'domains',
    'design',
    'marketing',
    'other',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0
      );

      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="mb-1 font-medium">{label}</p>
          <p className="mb-2 text-sm font-semibold border-b pb-1">
            Total: ${total.toFixed(2)}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 py-0.5">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-xs">
                {entry.name}: ${entry.value.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Monthly Expense Trend</CardTitle>
        <CardDescription>Your subscription costs over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tickCount={5}
                domain={[0, 'dataMax + 50']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value) => CATEGORY_LABELS[value as ExpenseCategory]}
              />
              {categories.map((category) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={`byCategory.${category}`}
                  name={category}
                  stackId="1"
                  fill={CATEGORY_COLORS[category]}
                  stroke={CATEGORY_COLORS[category]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}