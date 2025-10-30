import Logo from './Logo';
import type { HTMLAttributes } from 'react';

export default function Header({ ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header className="sticky flex items-center justify-center align-middle" {...props}>
      <Logo className="border" />
      <h1 className="border text-nowrap">Healthcare Benefits</h1>
    </header>
  );
}
