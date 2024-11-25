'use client';

import { Providers } from './providers';
import './globals.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en">
      <body>
        {isAuthPage ? (
          children
        ) : (
          <Providers>{children}</Providers>
        )}
      </body>
    </html>
  );
}