import { useEffect, useRef, useState } from 'react';

export interface SidebarProps {
  children: React.ReactNode;
  title: string;
}

export function Sidebar({ children, title }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const closeMobileSidebar = () => setIsMobileOpen(false);

  // Focus the close button when the mobile modal opens
  useEffect(() => {
    if (isMobileOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMobileOpen]);

  // Close on Escape and restore focus to the FAB
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
        fabRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  return (
    <>
      {/* Desktop / tablet sidebar (>= 768px): sticky, always visible.
          No card/padding wrapper: the child renders its own card (BEA-47). */}
      <aside
        aria-label={title}
        className="hidden md:flex md:flex-col md:w-[300px] md:flex-shrink-0 md:sticky md:top-8 md:max-h-[calc(100vh-4rem)] overflow-y-auto"
      >
        {!isMobileOpen && children}
      </aside>

      {/* Mobile (< 768px): floating action button */}
      <button
        ref={fabRef}
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open sidebar"
        className="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Mobile overlay / modal */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Click-outside backdrop */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeMobileSidebar}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            tabIndex={-1}
          />

          {/* Sidebar panel */}
          <div className="relative w-[300px] max-w-[85vw] h-full bg-gray-50 border-l border-gray-200 shadow-xl overflow-y-auto p-6 flex flex-col">
            <div className="flex items-center justify-end mb-4">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMobileSidebar}
                aria-label="Close sidebar"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
