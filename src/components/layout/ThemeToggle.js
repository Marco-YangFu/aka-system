import { jsx as _jsx } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function ThemeToggle() {
  const [dark, setDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setDark(saved === 'dark');
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return _jsx(Button, {
    variant: 'ghost',
    size: 'icon',
    onClick: () => setDark((d) => !d),
    'aria-label': 'Toggle theme',
    children: dark ? _jsx(Sun, {}) : _jsx(Moon, {}),
  });
}
