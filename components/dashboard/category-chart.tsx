'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategorySummary, ExpenseCategory } from '@/lib/types';

interface CategoryChartProps {
  data: CategorySummary[];
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

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: CATEGORY_LABELS[item.category],
      value: item.totalAmount,
      percentage: item.percentageOfTotal.toFixed(1),
      category: item.category,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-80 w-full flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                animationDuration={800}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.category]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {chartData.map((category) => (
              <div key={category.category} className="flex items-center gap-1.5">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: CATEGORY_COLORS[category.category] }} 
                />
                <span className="text-xs font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}