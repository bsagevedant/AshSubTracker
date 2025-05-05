'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, CreditCard, BarChart2, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const routes = [
  {
    name: 'Dashboard',
    path: '/',
    icon: BarChart2,
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: CreditCard,
  },
  {
    name: 'Calendar',
    path: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pr-0">
        <div className="flex flex-col gap-4 px-4">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => setOpen(false)}
          >
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="font-bold">AshSubTracker</span>
          </Link>
          <nav className="flex flex-col gap-2">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center py-2 text-base font-medium transition-colors hover:text-primary',
                  pathname === route.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <route.icon className="mr-2 h-5 w-5" />
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}