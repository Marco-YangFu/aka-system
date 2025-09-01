import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppShell from '@/components/layout/Appshell';
import '@/index.css';

function Page({ title }: { title: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">雛形ページ</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppShell>
        <Page title="ダッシュボード" />
      </AppShell>
    ),
  },
  {
    path: '/employees',
    element: (
      <AppShell>
        <Page title="社員" />
      </AppShell>
    ),
  },
  {
    path: '/settings',
    element: (
      <AppShell>
        <Page title="設定" />
      </AppShell>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
