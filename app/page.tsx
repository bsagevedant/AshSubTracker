import {
  DollarSign,
  TrendingUp,
  Calendar as CalendarIcon,
  LineChart,
} from 'lucide-react';

import { StatsCard } from '@/components/dashboard/stats-card';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { ExpenseTrend } from '@/components/dashboard/expense-trend';
import { RenewalsCard } from '@/components/dashboard/renewals-card';
import { OptimizationCard } from '@/components/dashboard/optimization-card';
import {
  mockExpenses,
  getCategorySummary,
  getMonthlyExpenseHistory,
  getUpcomingRenewals,
  getOptimizationSuggestions,
  getMonthlyBurn,
} from '@/lib/data';

export default function Home() {
  const monthlyBurn = getMonthlyBurn(mockExpenses);
  const categorySummary = getCategorySummary(mockExpenses);
  const monthlyHistory = getMonthlyExpenseHistory();
  const upcomingRenewals = getUpcomingRenewals(mockExpenses);
  const optimizationSuggestions = getOptimizationSuggestions(mockExpenses);
  const activeCount = mockExpenses.filter(e => e.active).length;
  
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track and optimize your SaaS expenses
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Monthly Burn"
          value={`$${monthlyBurn.toFixed(2)}`}
          description="Recurring expenses"
          icon={<DollarSign />}
        />
        <StatsCard
          title="Active Subscriptions"
          value={activeCount}
          description="Across all categories"
          icon={<TrendingUp />}
        />
        <StatsCard
          title="Next Renewal"
          value={upcomingRenewals.length > 0
            ? upcomingRenewals[0].name
            : 'None'
          }
          description={upcomingRenewals.length > 0
            ? `$${upcomingRenewals[0].amount} on ${upcomingRenewals[0].nextRenewal?.toLocaleDateString()}`
            : 'No upcoming renewals'
          }
          icon={<CalendarIcon />}
        />
        <StatsCard
          title="Largest Category"
          value={categorySummary.length > 0
            ? `$${categorySummary[0].totalAmount.toFixed(2)}`
            : '$0'
          }
          description={categorySummary.length > 0
            ? categorySummary[0].category.charAt(0).toUpperCase() + categorySummary[0].category.slice(1)
            : 'No expenses'
          }
          icon={<LineChart />}
        />
      </div>
      
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ExpenseTrend data={monthlyHistory} />
      </div>
      
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CategoryChart data={categorySummary} />
        <div className="flex flex-col gap-4 md:col-span-1 lg:col-span-2">
          <RenewalsCard renewals={upcomingRenewals} />
          <OptimizationCard optimizations={optimizationSuggestions} />
        </div>
      </div>
    </div>
  );
}