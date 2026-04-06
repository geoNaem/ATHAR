'use client';

import { useTranslations, useLocale } from 'next-intl';
import { locales, Link, usePathname, useRouter } from '../src/navigation';
import { useState, useEffect } from 'react';

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
    <rect width="24" height="24" rx="4" fill="#C84B31"/>
    <path d="M12 6L6 18H18L12 6Z" fill="#F5EDD9"/>
    <circle cx="12" cy="14" r="2" fill="#C84B31"/>
  </svg>
);

export default function Navbar() {
  const t = useTranslations('Navbar');
  const common = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[1000px] rounded-full transition-all duration-500 border ${scrolled ? 'bg-[#2C1503]/80 backdrop-blur-xl border-[#E8A87C]/20 py-2' : 'bg-transparent border-transparent py-4'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '12px' }}>
      
      {/* Brand Lockup */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LogoIcon />
        <span className="font-serif text-bone" style={{ fontSize: '1.25rem', marginRight: '6px' }}>Athar</span>
        <span className="text-sienna" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: '1.1rem' }}>أثر</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex" style={{ gap: '24px', alignItems: 'center' }}>
        {['how_it_works', 'methodology', 'about', 'contact'].map((item) => (
          <Link 
            key={item} 
            href={`#${item.replace(/_/g, '-')}`} 
            className="text-accent transition-colors hover:text-bone"
            style={{ fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}
          >
            {t(item)}
          </Link>
        ))}
      </div>

      {/* Utility Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Language Toggle Pill */}
        <div style={{ display: 'flex', background: '#2C1503', borderRadius: '100px', border: '1px solid #E8A87C', overflow: 'hidden', padding: '2px' }}>
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLanguage(l)}
              style={{
                background: locale === l ? '#C84B31' : 'transparent',
                color: locale === l ? '#FFFFFF' : '#E8A87C',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {common(l)}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="#request-access" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '4px' }}>
          {common('request_access')}
        </Link>
      </div>

    </nav>
  );
}
