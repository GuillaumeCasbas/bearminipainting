import { Link, NavLink, useLocation } from 'react-router-dom';
import { CHANGELOG_URL } from '@/ui/version';

const TAGLINE = 'Track your miniature painting progress';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${
    isActive
      ? 'font-semibold text-blue-800 underline'
      : 'text-blue-600 hover:text-blue-800 underline'
  }`;

function Brand() {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const content = 'MiniPaint';
  const className = 'text-lg font-bold text-gray-900 hover:text-blue-800 transition-colors';

  if (isHomePage) {
    return (
      <h1 className="text-lg font-bold">
        <Link to="/" className={className}>
          {content}
        </Link>
      </h1>
    );
  }

  return (
    <Link to="/" className={className}>
      {content}
    </Link>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <nav className="mb-6">
      <div className="flex items-center justify-between gap-4 border-b border-gray-300 pb-3">
        <Brand />
        <ul className="flex items-center gap-4">
          <li>
            <NavLink to="/settings" className={navLinkClassName}>
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={navLinkClassName}>
              About
            </NavLink>
          </li>
          <li>
            <a
              href={CHANGELOG_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              Changelog
            </a>
          </li>
        </ul>
      </div>
      {isHomePage && <p className="text-gray-600 mt-2">{TAGLINE}</p>}
    </nav>
  );
}
