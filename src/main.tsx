import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import EmployeeDetailPage from './features/employees/EmployeesDetailPage';

import AppShell from '@/components/layout/AppShell';
import EmployeeNewPage from '@/features/employees/EmployeeNewPage';
import EmployeesPage from '@/features/employees/EmployeePage';
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
        <EmployeesPage />
      </AppShell>
    ),
  },
  {
    path: '/employees/:id',
    element: (
      <AppShell>
        <EmployeeDetailPage />
      </AppShell>
    ),
  },
  {
    path: '/employees/new',
    element: (
      <AppShell>
        <EmployeeNewPage />
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

// React Query Client を作成
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
