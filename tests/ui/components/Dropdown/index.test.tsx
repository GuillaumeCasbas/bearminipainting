/**
 * Tests for Dropdown component
 * BEA-29: Feature - Delete a todo
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dropdown, DropdownItem } from '../../../../src/ui/components/Dropdown';

describe('Dropdown', () => {
  const triggerText = 'Toggle Dropdown';
  const menuItemText = 'Menu Item';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render trigger element', () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      expect(screen.getByText(triggerText)).toBeInTheDocument();
    });

    it('should not render menu by default', () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      expect(screen.queryByText(menuItemText)).not.toBeInTheDocument();
    });

    it('should render menu when isOpen is true', () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>} defaultOpen={true}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      expect(screen.getByText(menuItemText)).toBeInTheDocument();
    });
  });

  describe('Toggle behavior', () => {
    it('should open dropdown when trigger is clicked', async () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const trigger = screen.getByText(triggerText);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText(menuItemText)).toBeInTheDocument();
      });
    });

    it('should close dropdown when trigger is clicked again', async () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const trigger = screen.getByText(triggerText);
      
      // Open dropdown
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.getByText(menuItemText)).toBeInTheDocument();
      });

      // Close dropdown
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.queryByText(menuItemText)).not.toBeInTheDocument();
      });
    });

    it('should close dropdown when clicking outside', async () => {
      render(
        <div>
          <Dropdown trigger={<div>{triggerText}</div>}>
            <DropdownItem>{menuItemText}</DropdownItem>
          </Dropdown>
          <button>Outside Button</button>
        </div>
      );

      const trigger = screen.getByText(triggerText);
      const outsideButton = screen.getByText('Outside Button');
      
      // Open dropdown
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.getByText(menuItemText)).toBeInTheDocument();
      });

      // Click outside - use mouseDown event
      fireEvent.mouseDown(outsideButton);
      await waitFor(() => {
        expect(screen.queryByText(menuItemText)).not.toBeInTheDocument();
      });
    });

    it('should close dropdown when pressing Escape', async () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const trigger = screen.getByText(triggerText);
      
      // Open dropdown
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.getByText(menuItemText)).toBeInTheDocument();
      });

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      await waitFor(() => {
        expect(screen.queryByText(menuItemText)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have aria-haspopup on trigger', () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const trigger = screen.getByText(triggerText);
      expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    });

    it('should update aria-expanded when toggled', async () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const trigger = screen.getByText(triggerText);
      
      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Open dropdown
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have role=menu on dropdown container', async () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>} defaultOpen={true}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should have role=menuitem on items', async () => {
      render(
        <Dropdown trigger={<div>{triggerText}</div>} defaultOpen={true}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const menuItem = screen.getByText(menuItemText);
      expect(menuItem).toHaveAttribute('role', 'menuitem');
    });
  });

  describe('onToggle callback', () => {
    it('should call onToggle with true when opened', async () => {
      const mockOnToggle = jest.fn();
      
      render(
        <Dropdown trigger={<div>{triggerText}</div>} onToggle={mockOnToggle}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const trigger = screen.getByText(triggerText);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(mockOnToggle).toHaveBeenCalledWith(true);
      });
    });

    it('should call onToggle with false when closed', async () => {
      const mockOnToggle = jest.fn();
      
      render(
        <Dropdown trigger={<div>{triggerText}</div>} defaultOpen={true} onToggle={mockOnToggle}>
          <DropdownItem>{menuItemText}</DropdownItem>
        </Dropdown>
      );

      const trigger = screen.getByText(triggerText);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(mockOnToggle).toHaveBeenCalledWith(false);
      });
    });
  });
});

describe('DropdownItem', () => {
  it('should render children', () => {
    render(
      <Dropdown trigger={<div>Trigger</div>} defaultOpen={true}>
        <DropdownItem>Test Item</DropdownItem>
      </Dropdown>
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const mockOnClick = jest.fn();
    
    render(
      <Dropdown trigger={<div>Trigger</div>} defaultOpen={true}>
        <DropdownItem onClick={mockOnClick}>Clickable</DropdownItem>
      </Dropdown>
    );

    const item = screen.getByText('Clickable');
    fireEvent.click(item);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should not call onClick when disabled', async () => {
    const mockOnClick = jest.fn();
    
    render(
      <Dropdown trigger={<div>Trigger</div>} defaultOpen={true}>
        <DropdownItem onClick={mockOnClick} disabled>Disabled</DropdownItem>
      </Dropdown>
    );

    const item = screen.getByText('Disabled');
    fireEvent.click(item);

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(item).toBeDisabled();
  });
});
