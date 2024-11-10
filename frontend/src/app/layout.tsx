"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Navigation from './components/Navigation';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const drawerWidth = 240;

// Metadata moved to separate metadata.ts file

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && (pathname !== '/login' && pathname !== '/signup')) {
      router.push('/login');
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
            <Toolbar />
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}
