import Logo from './Logo';
import type { HTMLAttributes } from 'react';

export default function Header({ ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header className="sticky flex gap-4 items-center justify-between align-middle border-b border-gray-300 mb-4 pb-2" {...props}>
      <Logo className="max-w-56 min-w-36 sm:max-w-3xs" />
      <h1 className="text-sm sm:text-2xl text-nowrap text-grey">Healthcare Benefits</h1>
    </header>
  );
}
