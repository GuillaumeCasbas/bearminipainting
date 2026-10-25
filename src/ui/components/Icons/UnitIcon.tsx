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
    <path d="M12 2l3 10-3 3-3-3 3-10z" />
    <path d="M12 22l-3-3 3-3 3 3-3 3z" />
  </svg>
);
