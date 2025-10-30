import Logo from './Logo';
import type { HTMLAttributes } from 'react';

export default function Header({ ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header
      className="sticky mb-4 flex items-center justify-between gap-4 border-b border-gray-300 pb-2 align-middle"
      {...props}
    >
      <Logo className="max-w-56 min-w-36 sm:max-w-3xs" />
      <h1 className="text-grey text-sm text-nowrap sm:text-2xl">Healthcare Benefits</h1>
    </header>
  );
}
