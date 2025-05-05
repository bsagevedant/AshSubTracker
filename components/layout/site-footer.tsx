import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              © 2025 AshSubTracker. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}