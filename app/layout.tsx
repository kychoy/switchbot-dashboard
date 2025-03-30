import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SwitchBot Dashboard',
  description: 'Monitor and control your SwitchBot devices',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* For now, system-based mode will work automatically if you don't set 'className="dark"' */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
        <div className="min-h-screen px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
