import type { Metadata } from 'next';

// Private/account page: keep out of search results.
export const metadata: Metadata = {
  title: 'Create Account | The Likem Perfumery',
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
