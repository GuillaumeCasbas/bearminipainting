import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useIsDesktop } from '@/ui/hooks/useIsDesktop';
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

function NavLinks() {
  return (
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
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const isDesktop = useIsDesktop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="mb-6">
      <div className="flex items-center justify-between gap-4 border-b border-gray-300 pb-3">
        <Brand />
        {isDesktop ? (
          <NavLinks />
        ) : (
          <div>
            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="navbar-menu"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {!isDesktop && isMenuOpen && (
        <div id="navbar-menu" className="mt-3">
          <ul className="flex flex-col gap-3 border-b border-gray-300 pb-3">
            <li>
              <NavLink
                to="/settings"
                className={navLinkClassName}
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={navLinkClassName}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li>
              <a
                href={CHANGELOG_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Changelog
              </a>
            </li>
          </ul>
        </div>
      )}
      {isHomePage && <p className="text-gray-600 mt-2">{TAGLINE}</p>}
    </nav>
  );
}
