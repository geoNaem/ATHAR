'use client';

import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');
  const common = useTranslations('Common');

  return (
    <section 
      style={{ 
        minHeight: '100dvh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        background: 'var(--near-black)',
        color: 'var(--bone)',
        paddingTop: '120px',
        paddingBottom: '100px'
      }}
    >
      <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Top Badge Pill */}
        <div 
          className="label reveal active" 
          style={{ 
            color: 'var(--accent)', 
            border: '1.5px solid var(--sienna)',
            background: 'rgba(200, 75, 49, 0.1)',
            padding: '6px 14px',
            borderRadius: '100px',
            marginBottom: '32px',
            fontSize: '11px',
            fontWeight: '600'
          }}
        >
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 
          className="reveal active font-serif text-bone" 
          style={{ 
            marginBottom: '24px', 
            maxWidth: '12ch', 
            textAlign: 'center',
            lineHeight: 1.1
          }}
        >
          {t('h1')}
        </h1>

        {/* Sub-headline */}
        <p 
          className="reveal active" 
          style={{ 
            maxWidth: '640px', 
            fontSize: '19px', 
            color: 'var(--accent)', 
            marginBottom: '48px',
            fontWeight: 400
          }}
        >
          {t('sub')}
        </p>

        {/* CTAs */}
        <div className="reveal active" style={{ display: 'flex', gap: '16px', marginBottom: '80px' }}>
          <a href="#request-access" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '15px' }}>
            {common('request_access')}
          </a>
          <a href="#how-it-works" className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '15px' }}>
            {common('see_how_it_works')}
          </a>
        </div>

        {/* Trust Bar */}
        <div 
          className="reveal active" 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '12px' 
          }}
        >
          {['trust1', 'trust2', 'trust3'].map((item) => (
            <div 
              key={item} 
              className="mono text-accent" 
              style={{ 
                border: '1px solid var(--accent)', 
                padding: '6px 16px', 
                borderRadius: '100px', 
                fontSize: '11px',
                fontWeight: 500,
                backgroundColor: 'transparent'
              }}
            >
              {t(item)}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
