import { Link, NavLink } from 'react-router-dom';
import { CHANGELOG_URL } from '@/ui/version';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${
    isActive
      ? 'font-semibold text-blue-800 underline'
      : 'text-blue-600 hover:text-blue-800 underline'
  }`;

export function Navbar() {
  return (
    <nav className="mb-6">
      <div className="flex items-center justify-between gap-4 border-b border-gray-300 pb-3">
        <Link
          to="/"
          className="text-lg font-bold text-gray-900 hover:text-blue-800 transition-colors"
        >
          MiniPaint
        </Link>
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
    </nav>
  );
}
