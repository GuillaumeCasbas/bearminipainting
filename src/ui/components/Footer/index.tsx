import { appVersion } from '@/ui/version';

export function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500 shrink-0">
      <p>MiniPaint {appVersion}</p>
    </footer>
  );
}
