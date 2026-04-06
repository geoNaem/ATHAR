'use client';

import { useTranslations } from 'next-intl';
import { LucideIcon, FileText, Table, BarChart2, ShieldCheck, Database, Globe, Layers, Settings, Microscope } from 'lucide-react';
import React from 'react';

// --- Shared Section Component ---
const Section = ({ 
  id, 
  label, 
  title, 
  sub, 
  className = '', 
  dark = false, 
  children 
}: { 
  id: string, 
  label: string, 
  title: string, 
  sub?: string, 
  className?: string, 
  dark?: boolean, 
  children: React.ReactNode 
}) => (
  <section id={id} className={`section-padding ${dark ? 'bg-dark' : 'bg-bone'} ${className}`}>
    <div className="container">
      <div className="reveal active" style={{ marginBottom: '64px', maxWidth: '800px' }}>
        <span className="label text-sienna" style={{ display: 'block', marginBottom: '16px' }}>{label}</span>
        <h2 className={`font-serif ${dark ? 'text-bone' : 'text-near-black'}`} style={{ marginBottom: '24px' }}>{title}</h2>
        {sub && <p className={dark ? 'text-accent' : 'text-near-black'} style={{ fontSize: '18px', maxWidth: '640px' }}>{sub}</p>}
      </div>
      {children}
    </div>
  </section>
);

// --- 1. THE PROBLEM ---
export const Problem = () => {
  const t = useTranslations('Problem');
  return (
    <Section id="problem" label={t('label')} title={t('h2')} sub={t('sub')}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {[1, 2, 3].map((num) => (
          <div key={num} className="reveal active" style={{ borderLeft: '3px solid var(--sienna)', paddingLeft: '20px' }}>
            <span className="label text-sienna" style={{ fontSize: '10px', display: 'block', marginBottom: '8px' }}>
              {t(`cards.${num}.label`)}
            </span>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
              {t(`cards.${num}.title`)}
            </h3>
            <p style={{ fontSize: '15px', color: 'rgba(44, 21, 3, 0.8)' }}>
              {t(`cards.${num}.body`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

// --- 2. WORKFLOW ---
export const Workflow = () => {
  const t = useTranslations('Workflow');
  return (
    <Section id="how-it-works" label={t('label')} title={t('h2')} className="bg-white">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', position: 'relative' }}>
        {[1, 2, 3].map((num) => (
          <div key={num} className="reveal active" style={{ position: 'relative' }}>
            <div className="font-serif text-sienna" style={{ fontSize: '64px', lineHeight: 1, marginBottom: '24px' }}>
              0{num}
            </div>
            <h3 style={{ marginBottom: '16px' }}>{t(`steps.${num}.title`)}</h3>
            <p style={{ fontSize: '15px', color: 'rgba(44, 21, 3, 0.7)', marginBottom: '16px' }}>
              {t(`steps.${num}.body`)}
            </p>
            <div className="mono text-sienna" style={{ fontSize: '11px', background: 'rgba(204, 88, 51, 0.1)', padding: '4px 10px', borderRadius: '4px', display: 'inline-block' }}>
              {t(`steps.${num}.chips`)}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// --- 3. METHODOLOGY ---
export const Methodology = () => {
  const t = useTranslations('Methodology');
  return (
    <Section id="methodology" label={t('label')} title={t('h2')} sub={t('sub')} dark>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <div 
            key={num} 
            className="reveal active" 
            style={{ 
              background: '#3D1A08', 
              border: '1px solid var(--accent)', 
              borderRadius: '6px', 
              padding: '24px',
              gridColumn: num === 5 ? 'span 1' : 'auto'
            }}
          >
            <div className="mono text-sienna" style={{ fontSize: '10px', marginBottom: '8px' }}>{t(`cards.${num}.label`)}</div>
            <h3 className="font-serif text-bone" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{t(`cards.${num}.title`)}</h3>
            <p className="text-accent" style={{ fontSize: '14px', lineHeight: 1.6 }}>{t(`cards.${num}.body`)}</p>
            {num === 5 && (
              <div 
                className="label" 
                style={{ 
                  marginTop: '16px', 
                  backgroundColor: 'var(--sienna)', 
                  color: 'var(--bone)', 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  borderRadius: '100px', 
                  fontSize: '10px' 
                }}
              >
                {t('cards.5.badge')}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

// --- 4. OUTPUT FORMATS ---
export const Output = () => {
  const t = useTranslations('Output');
  const Icons = [FileText, Table, BarChart2];
  return (
    <Section id="output" label={t('label')} title={t('h2')} sub={t('sub')}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {[1, 2, 3].map((num) => {
          const Icon = Icons[num-1];
          return (
            <div 
              key={num} 
              className="reveal active" 
              style={{ 
                background: 'var(--pure-white)', 
                borderTop: '3px solid var(--sienna)', 
                padding: '32px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ color: 'var(--sienna)', marginBottom: '24px' }}>
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
                {t(`cards.${num}.title`)}
                {num === 2 && (
                  <span className="label" style={{ marginLeft: '12px', background: 'var(--sienna)', color: 'white', padding: '2px 8px', fontSize: '10px', borderRadius: '2px' }}>
                    {t('cards.2.badge')}
                  </span>
                )}
              </h3>
              <p style={{ fontSize: '15px', color: 'rgba(44, 21, 3, 0.8)', marginBottom: '24px', flex: '1' }}>
                {t(`cards.${num}.body`)}
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {(t.raw(`cards.${num}.features`) as string[]).map((f: string, i: number) => (
                  <li key={i} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--sienna)', marginRight: '8px' }}>•</span> {f}
                  </li>
                ))}
              </ul>
              <div className="mono text-sienna" style={{ fontWeight: 600 }}>{t(`cards.${num}.format`)}</div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

// --- 5. PRIVACY ---
export const Privacy = () => {
  const t = useTranslations('Privacy');
  return (
    <Section id="privacy" label={t('label')} title={t('h2')} dark>
      <div className="reveal active" style={{ textAlign: 'center', margin: '48px 0' }}>
        <p className="font-serif text-accent" style={{ fontSize: '24px', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto' }}>
          {t('quote')}
        </p>
        <div style={{ width: '80px', height: '1px', background: 'var(--sienna)', margin: '40px auto' }}></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
        {[1, 2, 3].map((num) => (
          <div key={num} className="reveal active" style={{ borderTop: '3px solid var(--sienna)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--bone)' }}>{t(`columns.${num}.title`)}</h3>
            <p className="text-accent" style={{ fontSize: '14px' }}>{t(`columns.${num}.body`)}</p>
          </div>
        ))}
      </div>
      <div className="mono text-sienna reveal active" style={{ textAlign: 'center', marginTop: '64px', fontSize: '11px' }}>
        {t('verification')}
      </div>
    </Section>
  );
};

// --- 6. TESTIMONIAL ---
export const Testimonial = () => {
  const t = useTranslations('SocialProof');
  return (
    <section className="section-padding bg-bone">
      <div className="container">
        <div style={{ maxWidth: '760px', margin: '0 auto', borderLeft: '4px solid var(--sienna)', paddingLeft: '48px' }}>
          <p className="font-serif reveal active" style={{ fontSize: '24px', fontStyle: 'italic', color: 'var(--near-black)', marginBottom: '32px' }}>
            "{t('quote')}"
          </p>
          <div className="reveal active">
            <div style={{ color: 'var(--sienna)', fontWeight: 700, marginBottom: '4px' }}>{t('attrib')}</div>
            <div style={{ fontSize: '14px', color: 'var(--near-black)' }}>{t('role')}</div>
            <div className="text-accent" style={{ fontSize: '12px', marginTop: '8px' }}>{t('prev')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 7. FIELD SPECIFIC ---
export const Field = () => {
  const t = useTranslations('Field');
  const Icons = [Globe, Layers, Settings, Microscope];
  return (
    <Section id="about" label={t('label')} title={t('h2')} className="bg-white">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px' }}>
        {[1, 2, 3, 4].map((num) => {
          const Icon = Icons[num-1];
          return (
            <div key={num} className="reveal active" style={{ display: 'flex', gap: '24px' }}>
              <div style={{ color: 'var(--sienna)', flexShrink: 0 }}>
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>{t(`features.${num}.title`)}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(44, 21, 3, 0.7)' }}>{t(`features.${num}.body`)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

// --- 8. FINAL CTA ---
export const FinalCTA = () => {
  const t = useTranslations('FinalCTA');
  const common = useTranslations('Common');
  return (
    <section className="section-padding" style={{ background: 'var(--sienna)', color: 'var(--pure-white)', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 className="font-serif reveal active" style={{ marginBottom: '24px' }}>{t('h2')}</h2>
        <p className="reveal active" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '40px' }}>
          {t('sub')}
        </p>
        <button className="btn btn-dark reveal active" style={{ padding: '16px 40px', fontSize: '18px' }}>
          {common('request_access')} →
        </button>
        <p className="reveal active" style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
};

// --- 9. FOOTER ---
export const Footer = () => {
  const t = useTranslations('Footer');
  const nav = useTranslations('Navbar');
  const common = useTranslations('Common');
  return (
    <footer className="section-padding bg-dark" style={{ borderTop: '1px solid var(--accent)', paddingBottom: '40px' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '48px', marginBottom: '80px' }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="font-serif text-bone" style={{ fontSize: '1.5rem', marginRight: '6px' }}>Athar</span>
              <span className="text-sienna" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: '1.3rem' }}>أثر</span>
            </div>
            <p className="text-accent" style={{ fontSize: '13px' }}>{nav('tagline')}</p>
          </div>
          <div style={{ display: 'flex', gap: '24px', fontWeight: 500 }}>
            {['how_it_works', 'methodology', 'about', 'contact'].map(k => (
              <a key={k} href={`#${k.replace(/_/g, '-')}`} className="text-accent hover:text-bone" style={{ fontSize: '13px', textDecoration: 'none' }}>{nav(k)}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></div>
            <span className="mono text-sienna" style={{ fontSize: '10px' }}>{common('system_operational')}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(232, 168, 124, 0.1)', paddingTop: '24px' }}>
          <span className="mono" style={{ fontSize: '11px', color: 'rgba(245, 237, 217, 0.4)' }}>{t('copy')}</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            {(t.raw('links') as string[]).map((l, i) => (
              <span key={i} className="mono" style={{ fontSize: '11px', color: 'rgba(245, 237, 217, 0.4)' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
