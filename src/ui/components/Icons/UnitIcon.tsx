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
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
    <path d="M12 20a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2z" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M4.22 4.22l1.42 1.42" />
    <path d="M18.36 18.36l1.42 1.42" />
    <path d="M4.22 19.78l1.42-1.42" />
    <path d="M18.36 5.64l1.42-1.42" />
    <path d="M12 7v2" />
    <path d="M12 15v2" />
  </svg>
);
