import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';
export function Header() {
    return (_jsxs("header", { className: "h-14 flex items-center px-4 gap-3 border-b bg-background", children: [_jsx("h1", { className: "font-semibold tracking-wide", children: "AKA System" }), _jsx(Separator, { orientation: "vertical", className: "h-5" }), _jsx("div", { className: "ml-auto", children: _jsx(ThemeToggle, {}) })] }));
}
