import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

export function Sidebar() {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'ダッシュボード' },
    { to: '/employees', label: '社員' },
    { to: '/settings', label: '設定' },
  ];

  return (
    <aside className="w-60 border-r p-3">
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'relative no-underline px-3 py-2 rounded text-sm transition-colors',
                active
                  ? 'bg-muted font-medium text-foreground visited:text-foreground'
                  : 'text-muted-foreground hover:bg-muted visited:text-muted-foreground'
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
