import type { Metadata } from 'next';

// Private/account page: keep out of search results.
export const metadata: Metadata = {
  title: 'Sign In | The Likem Perfumery',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
