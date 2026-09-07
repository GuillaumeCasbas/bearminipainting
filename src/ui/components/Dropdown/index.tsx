/**
 * Reusable Dropdown component for MiniPaint application
 *
 * Features:
 * - Custom trigger element (can be a button or div)
 * - Positionable dropdown menu (right, left, bottom)
 * - Keyboard accessible (tabindex, arrow keys, Enter/Esc)
 * - Click outside to close
 */

import { useState, useRef, useEffect, ReactElement, cloneElement, ReactNode } from 'react';

interface DropdownProps {
  /** Element that triggers the dropdown (should accept onClick) */
  trigger: ReactElement;
  /** Dropdown menu items */
  children: ReactNode;
  /** Position of dropdown relative to trigger */
  position?: 'right' | 'left' | 'bottom';
  /** Custom className for dropdown container */
  className?: string;
  /** Whether dropdown is initially open */
  defaultOpen?: boolean;
  /** Callback when dropdown opens/closes */
  onToggle?: (isOpen: boolean) => void;
}

export function Dropdown({
  trigger,
  children,
  position = 'right',
  className = '',
  defaultOpen = false,
  onToggle,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onToggle?.(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onToggle?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onToggle]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'right-0 mr-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'right':
      default:
        return 'left-full ml-2';
    }
  };

  // Clone trigger element and add onClick handler
  // Use any type for props to allow adding onClick to any element
  const triggerWithHandler = cloneElement(
    trigger,
    {
      onClick: toggleDropdown,
      'aria-haspopup': 'true' as const,
      'aria-expanded': isOpen,
    } as any
  );

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={dropdownRef}
    >
      {triggerWithHandler}

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute z-50 ${getPositionClasses()} min-w-[140px] bg-white rounded-md shadow-lg border border-gray-200 py-1`}
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown item component for consistent styling
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
  disabled?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  className = '',
  danger = false,
  disabled = false,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
        danger
          ? 'text-red-700 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      role="menuitem"
      tabIndex={0}
    >
      {children}
    </button>
  );
}
