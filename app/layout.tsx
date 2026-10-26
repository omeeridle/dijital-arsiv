import type { Metadata } from 'next';
import './globals.css';
import Manifesto from './Manifesto';

export const metadata: Metadata = {
  title: 'bearth',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased bg-[#FDFDFD] relative">
        
        {/* Analog Film Greni */}
        <div 
          className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.035]"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat' 
          }}
        />
        
        {/* Sürgülü Felsefe Menüsü */}
        <Manifesto />

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}