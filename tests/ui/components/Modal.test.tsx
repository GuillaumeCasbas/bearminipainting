import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from '../../../src/ui/components/Modal';

describe('Modal', () => {
  const renderOpenModal = (onClose: () => void = jest.fn()) =>
    render(
      <Modal isOpen={true} onClose={onClose} title="Confirm action">
        <p>Modal content</p>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>,
    );

  it('should render the title and content when open', () => {
    renderOpenModal();

    expect(screen.getByText('Confirm action')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should render nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Confirm action">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.queryByText('Confirm action')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should have role dialog with aria-modal and labelled title', () => {
    renderOpenModal();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const title = screen.getByText('Confirm action');
    const labelId = title.getAttribute('id');
    expect(labelId).toBeTruthy();
    expect(dialog).toHaveAttribute('aria-labelledby', labelId);
  });

  it('should call onClose when Escape is pressed inside the dialog', () => {
    const onClose = jest.fn();
    renderOpenModal(onClose);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when Escape is pressed outside the dialog', () => {
    const onClose = jest.fn();
    renderOpenModal(onClose);

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when the backdrop is clicked', () => {
    const onClose = jest.fn();
    renderOpenModal(onClose);

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when the panel content is clicked', () => {
    const onClose = jest.fn();
    renderOpenModal(onClose);

    fireEvent.click(screen.getByText('Modal content'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should move focus into the dialog when opened', () => {
    renderOpenModal();

    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('should restore focus to the trigger element when closed', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open modal';
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Confirm action">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toHaveFocus();

    rerender(
      <Modal isOpen={false} onClose={jest.fn()} title="Confirm action">
        <p>Modal content</p>
      </Modal>,
    );

    expect(trigger).toHaveFocus();
    document.body.removeChild(trigger);
  });

  it('should trap Tab focus inside the dialog (wraps from last to first)', () => {
    renderOpenModal();

    screen.getByRole('button', { name: 'Last' }).focus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('should wrap Shift+Tab focus from the first element to the last', () => {
    renderOpenModal();

    screen.getByRole('button', { name: 'First' }).focus();
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Tab',
      shiftKey: true,
    });

    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
  });

  it('should not re-run open effects when the parent re-renders with a new inline onClose', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose} title="Confirm action">
        <p>Modal content</p>
      </Modal>,
    );

    rerender(
      <Modal isOpen={true} onClose={() => onClose()} title="Confirm action">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toHaveFocus();
  });
});
