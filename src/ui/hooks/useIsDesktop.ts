import { useEffect, useState } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_MEDIA_QUERY).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}
