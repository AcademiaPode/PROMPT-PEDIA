
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/app-header';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Prompt Ped-IA', // Web page title remains Prompt Ped-IA
  description: 'Genera prompts de IA de alta calidad con facilidad. Potencia tu creatividad y productividad con nuestra plataforma avanzada.',
  manifest: '/manifest.json', // Link to manifest
  icons: {
    apple: '/icons/icon-192x192.png', // Apple touch icon
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1a1a', // Updated to match manifest.json theme_color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect to Google Fonts if still used or other critical origins */}
      </head>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <AppHeader />
        
        <div className="flex-grow">
          {children}
        </div>

        <footer className="border-t border-border/40 bg-background">
          <div className="container mx-auto py-6 px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
              {/* Left/Center: Brand */}
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-foreground text-lg">Prompt Ped-IA</h3>
                <p className="text-xs text-muted-foreground">Potenciando la IA, una idea a la vez.</p>
              </div>
              {/* Right: Social Icons */}
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.instagram.com/ellegadofinanciero?igsh=Zzh1dXFqaXpodnU5" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-[#E1306C] transition-colors"
                  aria-label="Instagram de El Legado Financiero"
                  title="Instagram de El Legado Financiero"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
                <a 
                  href="https://youtube.com/@ellegadofinanciero.oficial?si=7TG7LSzpGRbsUvms" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-[#FF0000] transition-colors"
                  aria-label="YouTube de El Legado Financiero"
                  title="YouTube de El Legado Financiero"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
                </a>
              </div>
            </div>
            {/* Copyright - on a new line, centered */}
            <div className="mt-6 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Prompt Ped-IA. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
        <Toaster />
        <Script id="service-worker-registration" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                  })
                  .catch(error => {
                    console.error('Service Worker registration failed:', error);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
