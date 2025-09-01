import { ThemeToggle } from './ThemeToggle';

import { Separator } from '@/components/ui/separator';

export function Header() {
  return (
    <header className="h-14 flex items-center px-4 gap-3 border-b bg-background">
      <h1 className="font-semibold tracking-wide">AKA System</h1>
      <Separator orientation="vertical" className="h-5" />
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
