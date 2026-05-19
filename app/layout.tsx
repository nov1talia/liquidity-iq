import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'LiquidityIQ — AI-Powered DLMM Liquidity Management',
  description: 'Intelligent liquidity management for Meteora DLMM pools on Solana',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex" style={{ background: '#0a0a0c', color: '#ffffff' }}>
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
