'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CreditCard, BarChart2, Calendar, Settings, Twitter } from 'lucide-react';

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

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block">AshSubTracker</span>
      </Link>
      <nav className="flex items-center gap-4 md:gap-6">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              pathname === route.path
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.name}
          </Link>
        ))}
        <Link
          href="https://x.com/sagevedant"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Twitter className="mr-2 h-4 w-4" />
          @sagevedant
        </Link>
      </nav>
    </div>
  );
}