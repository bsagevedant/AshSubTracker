import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AshSubTracker - Smart Expense Management for SaaS Founders',
  description: 'Track, manage, and optimize your SaaS subscriptions and expenses as a solo founder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <MainNav />
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <MobileNav />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}