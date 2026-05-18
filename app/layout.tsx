import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DegenDesk — AI Web3 Command Center',
  description: 'AI command center for airdrops, mints, wallets, gas, and on-chain operations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
