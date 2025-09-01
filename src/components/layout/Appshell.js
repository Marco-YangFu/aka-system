import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
export default function AppShell({ children }) {
  return _jsxs('div', {
    className: 'min-h-dvh bg-background text-foreground',
    children: [
      _jsx(Header, {}),
      _jsxs('div', {
        className: 'flex',
        children: [
          _jsx(Sidebar, {}),
          _jsx('main', { className: 'flex-1 p-4', children: children }),
        ],
      }),
    ],
  });
}
