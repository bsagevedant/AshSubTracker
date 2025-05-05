import { Expense, ExpenseCategory, CategorySummary, MonthlyExpenseSummary } from './types';

// Mock data for the application
export const mockExpenses: Expense[] = [
  {
    id: '1',
    name: 'Vercel',
    description: 'Pro plan for hosting',
    amount: 20,
    currency: 'USD',
    category: 'development',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-15'),
    startDate: new Date('2024-01-15'),
    active: true,
    notes: 'Used for 3 projects',
    tags: ['hosting', 'nextjs'],
    usefulness: 9,
  },
  {
    id: '2',
    name: 'Supabase',
    description: 'Pro plan for database',
    amount: 25,
    currency: 'USD',
    category: 'development',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-20'),
    startDate: new Date('2024-02-20'),
    active: true,
    tags: ['database', 'backend'],
    usefulness: 8,
  },
  {
    id: '3',
    name: 'GitHub',
    description: 'Pro plan',
    amount: 4,
    currency: 'USD',
    category: 'development',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-05'),
    startDate: new Date('2023-07-05'),
    active: true,
    usefulness: 10,
  },
  {
    id: '4',
    name: 'OpenAI API',
    description: 'GPT-4o usage',
    amount: 50,
    currency: 'USD',
    category: 'ai',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-01'),
    startDate: new Date('2024-01-01'),
    active: true,
    notes: 'Variable cost based on usage',
    tags: ['api', 'llm'],
    usefulness: 9,
  },
  {
    id: '5',
    name: 'ashsubtracker.com',
    description: 'Domain renewal',
    amount: 12,
    currency: 'USD',
    category: 'domains',
    type: 'recurring',
    billingCycle: 'yearly',
    nextRenewal: new Date('2026-01-10'),
    startDate: new Date('2024-01-10'),
    active: true,
    tags: ['domain'],
    usefulness: 10,
  },
  {
    id: '6',
    name: 'Figma',
    description: 'Professional plan',
    amount: 15,
    currency: 'USD',
    category: 'design',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-12'),
    startDate: new Date('2023-07-12'),
    active: true,
    tags: ['design', 'ui'],
    usefulness: 8,
  },
  {
    id: '7',
    name: 'ConvertKit',
    description: 'Creator plan',
    amount: 29,
    currency: 'USD',
    category: 'marketing',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-18'),
    startDate: new Date('2024-03-18'),
    active: true,
    tags: ['email', 'marketing'],
    usefulness: 7,
  },
  {
    id: '8',
    name: 'Tailwind UI',
    description: 'Component library',
    amount: 149,
    currency: 'USD',
    category: 'design',
    type: 'one-time',
    startDate: new Date('2024-02-05'),
    active: true,
    tags: ['ui', 'components'],
    usefulness: 9,
  },
  {
    id: '9',
    name: 'Mixpanel',
    description: 'Growth plan',
    amount: 25,
    currency: 'USD',
    category: 'marketing',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-08'),
    startDate: new Date('2024-04-08'),
    active: true,
    tags: ['analytics'],
    usefulness: 6,
  },
  {
    id: '10',
    name: 'Claude API',
    description: 'AI assistant integration',
    amount: 30,
    currency: 'USD',
    category: 'ai',
    type: 'recurring',
    billingCycle: 'monthly',
    nextRenewal: new Date('2025-07-14'),
    startDate: new Date('2024-05-14'),
    active: true,
    tags: ['api', 'llm'],
    usefulness: 8,
  },
];

// Calculate category summary
export function getCategorySummary(expenses: Expense[]): CategorySummary[] {
  const activeExpenses = expenses.filter(e => e.active);
  const totalAmount = activeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categorySums: Record<ExpenseCategory, { total: number; count: number }> = {
    development: { total: 0, count: 0 },
    ai: { total: 0, count: 0 },
    domains: { total: 0, count: 0 },
    design: { total: 0, count: 0 },
    marketing: { total: 0, count: 0 },
    other: { total: 0, count: 0 },
  };
  
  activeExpenses.forEach(expense => {
    categorySums[expense.category].total += expense.amount;
    categorySums[expense.category].count += 1;
  });
  
  return Object.entries(categorySums)
    .map(([category, { total, count }]) => ({
      category: category as ExpenseCategory,
      totalAmount: total,
      count,
      percentageOfTotal: totalAmount > 0 ? (total / totalAmount) * 100 : 0,
    }))
    .filter(summary => summary.count > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

// Get monthly expenses for the last 6 months
export function getMonthlyExpenseHistory(): MonthlyExpenseSummary[] {
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  return months.map((month, index) => {
    // Simulate some variation in monthly expenses
    const baseFactor = 0.9 + (index * 0.05);
    
    return {
      month,
      total: Math.round(sum(Object.values(getCategoryMonthlyAmounts(baseFactor)))),
      byCategory: getCategoryMonthlyAmounts(baseFactor),
    };
  });
}

// Helper function to get category amounts for a month
function getCategoryMonthlyAmounts(variationFactor: number): Record<ExpenseCategory, number> {
  const categoryBaseAmounts: Record<ExpenseCategory, number> = {
    development: 49,
    ai: 80,
    domains: 12 / 12, // Yearly cost divided by 12
    design: 15 + (149 / 12), // Monthly + amortized one-time
    marketing: 54,
    other: 10,
  };
  
  return Object.entries(categoryBaseAmounts).reduce((result, [category, amount]) => {
    // Add some randomness to simulate real-world variation
    const randomFactor = 0.85 + (Math.random() * 0.3);
    result[category as ExpenseCategory] = Math.round(amount * variationFactor * randomFactor);
    return result;
  }, {} as Record<ExpenseCategory, number>);
}

// Helper function to sum array values
function sum(values: number[]): number {
  return values.reduce((total, val) => total + val, 0);
}

// Get upcoming renewals
export function getUpcomingRenewals(expenses: Expense[], days: number = 30): Expense[] {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return expenses
    .filter(expense => 
      expense.active && 
      expense.type === 'recurring' && 
      expense.nextRenewal && 
      expense.nextRenewal >= today && 
      expense.nextRenewal <= futureDate
    )
    .sort((a, b) => (a.nextRenewal as Date).getTime() - (b.nextRenewal as Date).getTime());
}

// Get optimization suggestions
export function getOptimizationSuggestions(expenses: Expense[]): { expense: Expense; suggestion: string }[] {
  const suggestions: { expense: Expense; suggestion: string }[] = [];
  
  expenses.forEach(expense => {
    if (expense.active) {
      if (expense.usefulness !== undefined && expense.usefulness < 6) {
        suggestions.push({
          expense,
          suggestion: `Consider canceling or finding alternatives - usefulness rating is low (${expense.usefulness}/10)`,
        });
      }
      
      if (expense.category === 'development' && expense.amount > 20) {
        suggestions.push({
          expense,
          suggestion: 'Check for more affordable alternatives or open-source options',
        });
      }
      
      if (expense.billingCycle === 'monthly' && expense.amount > 15) {
        suggestions.push({
          expense,
          suggestion: 'Consider annual billing to save money (typically 10-20% discount)',
        });
      }
    }
  });
  
  return suggestions;
}

// Get monthly burn amount
export function getMonthlyBurn(expenses: Expense[]): number {
  const activeExpenses = expenses.filter(e => e.active);
  
  return activeExpenses.reduce((total, expense) => {
    if (expense.type === 'recurring') {
      switch (expense.billingCycle) {
        case 'monthly':
          return total + expense.amount;
        case 'quarterly':
          return total + (expense.amount / 3);
        case 'yearly':
          return total + (expense.amount / 12);
        default:
          return total;
      }
    }
    return total;
  }, 0);
}