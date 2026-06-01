import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Hunter Agent for Kamila Chudzik',
  description: 'Autonomous AI-powered job search dashboard for Kamila Chudzik',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="mesh-bg min-h-screen">{children}</body>
    </html>
  );
}
