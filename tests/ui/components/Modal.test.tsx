import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from '../../../src/ui/components/Modal';

describe('Modal', () => {
  const renderOpenModal = (onClose: () => void = jest.fn()) =>
    render(
      <Modal isOpen={true} onClose={onClose} title="Confirm action">
        <p>Modal content</p>
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

  it('should call onClose when Escape is pressed', () => {
    const onClose = jest.fn();
    renderOpenModal(onClose);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
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

  it('should not call onClose on backdrop click when closeOnBackdropClick is false', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Confirm action" closeOnBackdropClick={false}>
        <p>Modal content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('dialog'));

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
});
