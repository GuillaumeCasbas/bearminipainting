import { FC, SVGProps } from 'react';

export interface UnitIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export const UnitIcon: FC<UnitIconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
    aria-hidden="true"
  >
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v8" />
    <path d="M9 17l3-3 3 3" />
    <path d="M12 14l-2-2 2 2 2-2" />
  </svg>
);
