import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  actions?: ReactNode;
}

export function Header({ actions }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MiniPaint</h1>
          <p className="text-gray-600 mt-1">Track your miniature painting progress</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link
            to="/settings"
            className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            Settings
          </Link>
          {actions && <div>{actions}</div>}
        </div>
      </div>
    </header>
  );
}
