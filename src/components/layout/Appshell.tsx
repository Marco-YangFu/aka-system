import { PropsWithChildren } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
