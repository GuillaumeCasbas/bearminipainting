import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../../src/ui/components/Header';

describe('Header', () => {
  it('should render the app title and tagline', () => {
    render(<Header />);

    expect(screen.getByText('MiniPaint')).toBeInTheDocument();
    expect(screen.getByText('Track your miniature painting progress')).toBeInTheDocument();
  });

  it('should not render the actions slot when none is provided', () => {
    const { container } = render(<Header />);

    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('should render the actions slot when provided', () => {
    render(<Header actions={<button data-testid="action-btn">Toggle</button>} />);

    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('should place actions on the right side of the header', () => {
    render(<Header actions={<button data-testid="action-btn">Toggle</button>} />);

    const action = screen.getByTestId('action-btn');
    expect(action).toBeInTheDocument();
  });
});
