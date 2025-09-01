import { jsx as _jsx } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
export function Sidebar() {
    const { pathname } = useLocation();
    const links = [
        { to: '/', label: 'ダッシュボード' },
        { to: '/employees', label: '社員' },
        { to: '/settings', label: '設定' },
    ];
    return (_jsx("aside", { className: "w-60 border-r p-3", children: _jsx("nav", { className: "flex flex-col gap-1", children: links.map(({ to, label }) => {
                const active = pathname === to;
                return (_jsx(Link, { to: to, className: cn('relative no-underline px-3 py-2 rounded text-sm transition-colors', active
                        ? 'bg-muted font-medium text-foreground visited:text-foreground'
                        : 'text-muted-foreground hover:bg-muted visited:text-muted-foreground'), children: label }, to));
            }) }) }));
}
