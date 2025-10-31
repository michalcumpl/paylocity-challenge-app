import Logo from './Logo';
import type { HTMLAttributes } from 'react';

export default function Header({ ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header
      className="sticky container my-2 flex items-center justify-between gap-4 align-middle"
      {...props}
    >
      <Logo className="max-w-36 min-w-36 sm:max-w-56" />
      <h1 className="text-grey text-sm text-nowrap sm:text-2xl">Healthcare Benefits</h1>
    </header>
  );
}
