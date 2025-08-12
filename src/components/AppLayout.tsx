import React from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row-reverse w-full h-screen bg-background">
      {children}
    </div>
  );
}