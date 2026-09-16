import { appVersion, CHANGELOG_URL } from '@/ui/version';

export function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500 shrink-0">
      <p>
        MiniPaint {appVersion} &middot;{' '}
        <a
          href={CHANGELOG_URL}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Changelog
        </a>
      </p>
    </footer>
  );
}
