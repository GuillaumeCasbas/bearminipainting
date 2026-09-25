import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '../../../src/ui/components/Footer';

describe('Footer', () => {
  it('renders the app version without a "v" prefix', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent(/MiniPaint\s+\d+\.\d+\.\d+/);
    expect(footer).not.toHaveTextContent('MiniPaint v');
  });

  it('does not contain any navigation link (About/Changelog moved to the navbar) (BEA-61)', () => {
    render(<Footer />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('About')).not.toBeInTheDocument();
    expect(screen.queryByText('Changelog')).not.toBeInTheDocument();
  });
});
