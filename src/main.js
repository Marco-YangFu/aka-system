import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/components/layout/Appshell';
import '@/index.css';
function Page({ title }) {
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-xl font-semibold", children: title }), _jsx("p", { className: "text-sm text-muted-foreground", children: "\u96DB\u5F62\u30DA\u30FC\u30B8" })] }));
}
const router = createBrowserRouter([
    {
        path: '/',
        element: (_jsx(AppShell, { children: _jsx(Page, { title: "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9" }) })),
    },
    {
        path: '/employees',
        element: (_jsx(AppShell, { children: _jsx(Page, { title: "\u793E\u54E1" }) })),
    },
    {
        path: '/settings',
        element: (_jsx(AppShell, { children: _jsx(Page, { title: "\u8A2D\u5B9A" }) })),
    },
]);
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
