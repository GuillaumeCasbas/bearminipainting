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

  it('renders the changelog link pointing to CHANGELOG.md on GitHub', () => {
    render(<Footer />);

    const link = screen.getByRole('link', { name: 'Changelog' });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/GuillaumeCasbas/bearminipainting/blob/main/CHANGELOG.md',
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
