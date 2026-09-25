import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../../src/ui/components/Header';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('Header', () => {
  it('should render the app title and tagline', () => {
    render(<Header />);
    expect(screen.getByRole('heading', { name: 'MiniPaint' })).toBeInTheDocument();
    expect(screen.getByText('Track your miniature painting progress')).toBeInTheDocument();
  });

  it('should not render the actions slot when none is provided', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Toggle' })).not.toBeInTheDocument();
  });

  it('should render the actions slot inside the header when provided', () => {
    render(<Header actions={<button>Toggle</button>} />);
    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
  });
});
