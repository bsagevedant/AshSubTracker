export type ExpenseType = 'recurring' | 'one-time';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly' | 'custom';

export type ExpenseCategory =
  | 'development'
  | 'ai'
  | 'domains'
  | 'design'
  | 'marketing'
  | 'other';

export interface Expense {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  type: ExpenseType;
  billingCycle?: BillingCycle;
  nextRenewal?: Date;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  notes?: string;
  tags?: string[];
  usefulness?: number; // 1-10 rating
}

export interface CategorySummary {
  category: ExpenseCategory;
  totalAmount: number;
  count: number;
  percentageOfTotal: number;
}

export interface MonthlyExpenseSummary {
  month: string;
  total: number;
  byCategory: Record<ExpenseCategory, number>;
}

export interface UserSettings {
  defaultCurrency: string;
  emailNotifications: boolean;
  renewalAlertDays: number;
  theme: 'light' | 'dark' | 'system';
}