'use client';

import { useState } from 'react';
import { PlusCircle, Download, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpenseCard } from '@/components/expenses/expense-card';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ExpenseFilters } from '@/components/expenses/expense-filters';
import { mockExpenses } from '@/lib/data';
import { Expense, ExpenseCategory } from '@/lib/types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [showActive, setShowActive] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>('amount-desc');

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    // Apply search filter
    const searchMatch = expense.name.toLowerCase().includes(search.toLowerCase()) ||
      (expense.description && expense.description.toLowerCase().includes(search.toLowerCase()));
    
    // Apply category filter
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(expense.category);
    
    // Apply active filter
    const activeMatch = !showActive || expense.active;
    
    return searchMatch && categoryMatch && activeMatch;
  });
  
  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortOrder) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'amount-asc':
        return a.amount - b.amount;
      case 'amount-desc':
        return b.amount - a.amount;
      case 'date-asc':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case 'date-desc':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      default:
        return 0;
    }
  });

  const handleAddExpense = (data: any) => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
      active: true,
    };
    
    setExpenses([...expenses, newExpense]);
    setIsAddOpen(false);
  };

  const handleEditExpense = (data: any) => {
    if (!editingExpense) return;
    
    const updatedExpenses = expenses.map((expense) =>
      expense.id === editingExpense.id ? { ...expense, ...data } : expense
    );
    
    setExpenses(updatedExpenses);
    setEditingExpense(undefined);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setExpenses(expenses.filter(expense => expense.id !== deletingId));
      setDeletingId(null);
    }
  };

  const exportData = () => {
    const jsonData = JSON.stringify(expenses, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage your recurring and one-time expenses
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsAddOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" disabled>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-grow">
          <ExpenseFilters
            search={search}
            setSearch={setSearch}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            showActive={showActive}
            setShowActive={setShowActive}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortOrder}
            onValueChange={setSortOrder}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="name-asc">Name (A to Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z to A)</SelectItem>
              <SelectItem value="date-desc">Date (Newest First)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={setEditingExpense}
            onDelete={handleDelete}
          />
        ))}
        {sortedExpenses.length === 0 && (
          <div className="col-span-full flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="mb-2 text-xl font-medium">No expenses found</p>
            <p className="text-sm text-muted-foreground">
              {search || selectedCategories.length > 0 || showActive
                ? 'Try changing your filters'
                : 'Add your first expense to get started'}
            </p>
            {!search && selectedCategories.length === 0 && !showActive && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Add expense dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your new expense.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleAddExpense}
            onCancel={() => setIsAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit expense dialog */}
      <Dialog
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(undefined)}
      >
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the details of your expense.
            </DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleEditExpense}
              onCancel={() => setEditingExpense(undefined)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense and remove it from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}