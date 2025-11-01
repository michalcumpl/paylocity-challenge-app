import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Modal from '../Modal';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('<Modal />', () => {
  it('renders children when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        <p>Should not show</p>
      </Modal>,
    );

    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking backdrop', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    const backdrop = document.querySelector('.bg-black\\/50');
    expect(backdrop).toBeTruthy();

    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <button>Focusable</button>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
