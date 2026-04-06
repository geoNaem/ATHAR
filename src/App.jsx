import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, CheckCircle2, FileText, Globe, Lock, Code2, Copy, FileSpreadsheet, Download, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENTS ---

const Navbar = ({ toggleLang, isRtl }) => {
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: { className: 'bg-background/80 backdrop-blur-xl border border-border shadow-sm text-primary', targets: navRef.current },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full" dir="auto">
      <nav ref={navRef} className="flex items-center justify-between w-full max-w-[1120px] px-6 py-4 rounded-[3rem] transition-all duration-300 text-dark">
        <div className="text-xl font-bold font-sans flex items-center gap-2">
          <span>Athar</span>
          <span className="font-arabic font-bold text-2xl">أثر</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="#how-it-works" className="hover:-translate-y-[1px] transition-transform">How it works</a>
          <a href="#methodology" className="hover:-translate-y-[1px] transition-transform">Methodology</a>
          <a href="#pricing" className="hover:-translate-y-[1px] transition-transform">Pricing</a>
          <a href="#signin" className="hover:-translate-y-[1px] transition-transform text-muted hover:text-dark">Sign in</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="text-xs font-mono font-semibold hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-widest">
            <Globe className="w-4 h-4" /> {isRtl ? 'EN' : 'عربي'}
          </button>
          <a href="#waitlist" className="bg-accent text-dark px-6 py-3 rounded-full text-sm font-bold shadow-md hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out flex items-center justify-center overflow-hidden relative group">
            <span className="relative z-10 block font-sans">Join Waitlist</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
          </a>
        </div>
      </nav>
    </div>
  );
};

const Hero = ({ isRtl }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-anim', {
        y: 40, opacity: 0
      }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: 'power3.out', delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <header ref={containerRef} className="relative min-h-[100dvh] pt-32 pb-20 flex flex-col justify-end bg-background text-dark px-4 overflow-hidden" dir="auto">
      {/* Background Image requested by Global Rule (Preset A vibe: organic textures, forest dark green - but adapted to the Deep Teal color palette). */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[1120px] mx-auto flex flex-col gap-8 md:w-2/3 items-start">
        <h1 className="hero-anim text-hero-heading font-serif leading-[1.1] text-balance">
          <span className="block font-sans font-bold text-h2 mb-4 tracking-tight">Your qualitative analysis.</span>
          <span className="block italic">Done before the coffee gets cold.</span>
        </h1>
        
        <div className="hero-anim text-hero-arabic font-arabic leading-[1.2] text-balance mb-2 block opcaity-80">
          <span className="block font-bold">تحليلك النوعي.</span>
          <span className="block">يُنجز قبل أن تبرد قهوتك.</span>
        </div>

        <p className="hero-anim text-body-fluid font-sans text-muted max-w-2xl text-balance">
          {isRtl ? 'تحول أثر نصوص المقابلات وجلسات النقاش إلى تحليل هيكلي جاهز للمتابعة والتقييم في دقائق — وليس أيام. مبني للعمل الميداني. ومؤتمن على البيانات الحساسة.' : 'Athar turns SSI and FGD transcripts into structured MEAL-ready analysis in minutes — not days. Built for the field. Trusted with sensitive data.'}
        </p>

        <div className="hero-anim flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
          <a href="#waitlist" className="w-full sm:w-auto bg-accent text-dark px-8 py-4 rounded-full text-body-fluid font-bold shadow-md hover:scale-[1.03] transition-all duration-300 ease-out flex items-center justify-center relative group">
            <span className="relative z-10 block break-none">{isRtl ? 'انضم لقائمة الانتظار' : 'Join the Waitlist'}</span>
          </a>
          <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full text-body-fluid font-bold text-dark hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            {isRtl ? 'شاهد كيف يعمل' : 'See how it works'} <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </a>
        </div>

        <div className="hero-anim flex flex-wrap gap-4 mt-8">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-semibold"><Lock className="w-4 h-4 text-primary" /> {isRtl ? 'صفر احتفاظ بالبيانات' : 'Zero data retention'}</div>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-semibold"><FileText className="w-4 h-4 text-primary" /> {isRtl ? '5 منهجيات تقييم' : '5 methodologies'}</div>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-semibold"><Globe className="w-4 h-4 text-primary" /> {isRtl ? 'عربي / EN' : 'EN / AR'}</div>
        </div>
      </div>
    </header>
  );
};

const Features = ({ isRtl }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        },
        y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out'
      });
      
      // Shuffler Logic
      const shufflerCards = gsap.utils.toArray('.shuffler-item');
      if (shufflerCards.length > 0) {
        gsap.set(shufflerCards, { 
          y: (i) => i * -8, scale: (i) => 1 - (i * 0.05), opacity: (i) => 1 - (i * 0.2), zIndex: (i) => shufflerCards.length - i
        });
        
        let tl1 = gsap.timeline({ repeat: -1 });
        tl1.to(shufflerCards[0], { y: -20, opacity: 0, scale: 1.05, duration: 0.5, ease: 'power2.inOut', delay: 2 })
           .set(shufflerCards[0], { zIndex: 0, y: (shufflerCards.length-1) * -8 })
           .to(shufflerCards.slice(1), { 
              y: '-= -8', scale: '+= 0.05', opacity: '+= 0.2', duration: 0.5, ease: 'power2.inOut', stagger: 0 
           }, "<")
           .to(shufflerCards[0], { opacity: 1 - ((shufflerCards.length - 1) * 0.2), scale: 1 - ((shufflerCards.length - 1) * 0.05), duration: 0.5 }, "<");
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-[clamp(80px,10vw,140px)] bg-background w-full px-4" dir="auto">
      <div className="max-w-[1120px] mx-auto">
        <h2 className="text-h2 font-serif mb-12">
          {isRtl ? 'نعرف كيف يبدو هذا الأسبوع.' : 'You have 3 FGD transcripts, a report due Friday, and 47 pages of notes that won\'t analyze themselves.'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Diagnostic Shuffler */}
          <div className="feature-card bg-surface rounded-[2rem] border-s-4 border-primary border border-border/50 shadow-md p-8 flex flex-col h-full hover:-translate-y-1 transition-transform">
            <h3 className="font-sans font-bold text-h3 mb-2">{isRtl ? 'قراءة متكررة للعثور على المحاور' : 'Reading & re-reading to find the themes'}</h3>
            <p className="font-sans italic text-muted mb-8">{isRtl ? 'البحث عن الإبرة في كومة القش' : 'Looking for the signal in the noise.'}</p>
            <div className="flex-grow flex items-center justify-center relative min-h-[160px]">
              <div className="relative w-full max-w-[200px] h-[100px]">
                {['Protection Risks', 'Coping Mechanisms', 'Resource Access'].map((t, i) => (
                  <div key={i} className="shuffler-item absolute top-0 left-0 w-full bg-white border border-border rounded-xl p-4 shadow-sm flex items-center gap-2 font-mono text-label">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Telemetry Typewriter */}
          <div className="feature-card bg-surface rounded-[2rem] border-s-4 border-primary border border-border/50 shadow-md p-8 flex flex-col h-full hover:-translate-y-1 transition-transform">
            <h3 className="font-sans font-bold text-h3 mb-2">{isRtl ? 'ترميز في إكسل لـ 6 ساعات متواصلة' : 'Coding in Excel for 6 hours straight'}</h3>
            <p className="font-sans italic text-muted mb-8">{isRtl ? 'خلايا لانهائية، تركيز متلاشٍ' : 'Infinite columns, fading focus.'}</p>
            <div className="flex-grow bg-dark rounded-xl p-4 font-mono text-white text-xs overflow-hidden relative shadow-inner">
              <div className="flex items-center gap-2 mb-2 text-[10px] text-accent/80 uppercase tracking-widest border-b border-white/10 pb-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Live Feed
              </div>
              <div className="opacity-70 leading-relaxed">
                <span className="text-primary italic">&gt;</span> row_42: identify code...<br/>
                <span className="text-primary italic">&gt;</span> map_to: Logframe 1.2<br/>
                <span className="text-primary italic">&gt;</span> extract_quote: "water is scarce"<br/>
                <span className="text-primary italic">&gt;</span> matrix_updated<span className="animate-pulse">_</span>
              </div>
            </div>
          </div>

          {/* Card 3: Cursor Protocol Scheduler */}
          <div className="feature-card bg-surface rounded-[2rem] border-s-4 border-primary border border-border/50 shadow-md p-8 flex flex-col h-full hover:-translate-y-1 transition-transform">
            <h3 className="font-sans font-bold text-h3 mb-2">{isRtl ? 'كتابة السردية في منتصف الليل' : 'Writing the narrative at midnight'}</h3>
            <p className="font-sans italic text-muted mb-8">{isRtl ? 'مطاردة موعد التسليم الأخير' : 'Chasing the Friday deadline.'}</p>
            <div className="flex-grow flex flex-col justify-center items-center relative">
               <div className="grid grid-cols-7 gap-2 text-center text-label font-mono w-full">
                 {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-muted">{d}</div>)}
                 {Array.from({length: 14}).map((_, i) => (
                   <div key={i} className={`h-6 rounded bg-border/40 ${i === 12 ? 'ring-2 ring-accent bg-accent/20' : ''}`}></div>
                 ))}
               </div>
               <div className="absolute top-[40%] right-[10%] w-4 h-4 text-primary -translate-x-2 -translate-y-2 pointer-events-none">
                 <svg viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="2" className="w-full h-full drop-shadow"><path d="M4 4l5.12 16.63a1 1 0 001.88.08l2.5-6.6 6.6-2.5a1 1 0 00-.08-1.88L4 4z"/></svg>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Protocol = ({ isRtl }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');
      if(cards.length > 0) {
        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 20%",
            endTrigger: containerRef.current,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            animation: gsap.to(card, {
              scale: 0.9, blur: "20px", opacity: 0.5, ease: "none"
            }),
            scrub: true
          });
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="how-it-works" className="py-[clamp(80px,10vw,140px)] bg-background relative" dir="auto">
      <div className="max-w-[1120px] mx-auto px-4 mb-20 text-center">
        <h2 className="text-h2 font-serif text-dark mb-4">{isRtl ? 'ثلاث خطوات. استراحة غداء واحدة.' : 'Three steps. One lunch break.'}</h2>
      </div>
      
      <div className="max-w-[1120px] mx-auto px-4 relative">
        {/* Card 1 */}
        <div className="protocol-card bg-surface border border-border rounded-[2rem] p-8 md:p-16 mb-24 shadow-lg flex flex-col md:flex-row items-center gap-12 text-left rtl:text-right relative z-10 w-full min-h-[400px]">
          <div className="w-full md:w-1/2">
            <span className="text-5xl font-serif text-primary opacity-50 block mb-6 outline-text">1</span>
            <h3 className="text-h2 font-sans font-bold mb-4">{isRtl ? 'الرفع' : 'Upload'}</h3>
            <p className="text-body-fluid text-muted mb-2">{isRtl ? 'ارفع نصوص المقابلات بنسق DOCX أو إجابات الاستبيانات بنسق إكسل.' : 'Upload DOCX transcripts or Excel response sheets.'}</p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            {/* Geometric Motif */}
            <svg viewBox="0 0 100 100" className="w-48 h-48 animate-[spin_20s_linear_infinite] opacity-80 text-primary">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
              <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="protocol-card bg-surface border border-border rounded-[3rem] p-12 md:p-16 mb-24 shadow-lg flex flex-col md:flex-row items-center gap-12 text-left rtl:text-right relative z-20 w-full min-h-[400px]">
          <div className="w-full md:w-1/2">
            <span className="text-5xl font-serif text-primary opacity-50 block mb-6 outline-text">2</span>
            <h3 className="text-h2 font-sans font-bold mb-4 items-center flex gap-3">{isRtl ? 'الضبط' : 'Configure'}</h3>
            <p className="text-body-fluid text-muted">{isRtl ? 'اختر المنهجية، القطاع، وألصق مؤشرات الإطار المنطقي الخاصة بك.' : 'Choose methodology, sector, and paste your logframe indicators.'}</p>
            <p className="mt-4 text-sm text-primary italic max-w-sm rounded p-3 bg-primary/5">{isRtl ? 'يقوم أثر بمواءمة المحاور الناشئة مع مؤشرات مشروعك.' : 'Athar aligns emergent themes to your actual project indicators.'}</p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center p-8">
            <div className="w-full h-32 relative bg-dark rounded-lg overflow-hidden border border-border">
               <div className="absolute top-0 bottom-0 left-0 w-1 bg-accent shadow-[0_0_15px_rgba(204,88,51,1)] blur-[1px] animate-[ping_3s_linear_infinite] md:animate-[scan_3s_linear_infinite]"></div>
               <div className="w-full h-full opacity-30 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="protocol-card bg-surface border border-border rounded-[3rem] p-12 md:p-16 shadow-lg flex flex-col md:flex-row items-center gap-12 text-left rtl:text-right relative z-30 w-full min-h-[400px]">
          <div className="w-full md:w-1/2">
            <span className="text-5xl font-serif text-primary opacity-50 block mb-6 outline-text">3</span>
            <h3 className="text-h2 font-sans font-bold mb-4">{isRtl ? 'التصدير' : 'Export'}</h3>
            <p className="text-body-fluid text-muted">{isRtl ? 'تقرير نصي، مصفوفة ترميز، أو ملخص بصري.' : 'Word report, Excel matrix, or visual summary.'}</p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
             <svg viewBox="0 0 200 60" className="w-full max-w-[300px] h-32 text-primary opacity-80">
                <path className="animate-[dash_3s_linear_infinite]" d="M0,30 L50,30 L60,10 L70,50 L80,30 L200,30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="1000" />
             </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const MethodologySection = ({ isRtl }) => {
  return (
    <section id="methodology" className="py-[clamp(80px,10vw,140px)] bg-background px-4" dir="auto">
      <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-1/3">
           <h2 className="text-h2 font-serif text-balance">{isRtl ? 'أنت تختار المنهجية. وأثر يتحدث لغتها.' : 'You choose the method. Athar speaks the language.'}</h2>
           <p className="mt-6 text-muted text-body-fluid mb-8">{isRtl ? 'ليست تقنية ذكاء اصطناعي عامة. منهجيات أكاديمية موثوقة للتقييم.' : 'MEAL methodology, not generic AI.'}</p>
        </div>
        
        {/* CSS :has() tab hack */}
        <div className="w-full md:w-2/3">
           <div className="flex flex-col gap-4">
              <label className="cursor-pointer group flex rounded-2xl bg-surface border border-border p-6 shadow-sm hover:shadow-md transition bg-white has-[:checked]:border-primary has-[:checked]:ring-1 ring-primary transition-all duration-300">
                <input type="radio" name="method" className="sr-only" defaultChecked />
                <div className="flex-1">
                  <h4 className="font-bold font-sans text-lg mb-2">Thematic Analysis</h4>
                  <p className="text-muted text-sm mb-4">Focuses on identifying, analyzing, and interpreting patterns of meaning (themes) within qualitative data. Based on Braun & Clarke.</p>
                  <span className="font-mono text-label bg-background px-2 py-1 rounded inline-block text-primary">WORD REPORT FORMAT</span>
                </div>
              </label>

              <label className="cursor-pointer group flex rounded-2xl bg-surface border border-border p-6 shadow-sm hover:shadow-md transition bg-white has-[:checked]:border-primary has-[:checked]:ring-1 ring-primary transition-all duration-300">
                <input type="radio" name="method" className="sr-only" />
                <div className="flex-1">
                  <h4 className="font-bold font-sans text-lg mb-2">Framework Analysis</h4>
                  <p className="text-muted text-sm mb-4">Highly structured induction approach. Organizes data into a matrix, allowing for within-case and between-case analysis. Ideal for policy-driven research.</p>
                  <span className="font-mono text-label bg-background px-2 py-1 rounded inline-block text-primary">EXCEL MATRIX</span>
                </div>
              </label>
              
              <label className="cursor-pointer group flex rounded-2xl bg-surface border border-border p-6 shadow-sm hover:shadow-md transition bg-white has-[:checked]:border-primary has-[:checked]:ring-1 ring-primary transition-all duration-300">
                <input type="radio" name="method" className="sr-only" />
                <div className="flex-1">
                  <h4 className="font-bold font-sans text-lg mb-2">Grounded Theory Coding</h4>
                  <p className="text-muted text-sm mb-4">Starts with analyzing a single case to formulate a theory, then examines other cases to see if they support it. Open and axial coding applied.</p>
                  <span className="font-mono text-label bg-background px-2 py-1 rounded inline-block text-primary">CODING TREE</span>
                </div>
              </label>

              <label className="cursor-pointer group flex rounded-2xl bg-surface border border-border p-6 shadow-sm hover:shadow-md transition bg-white has-[:checked]:border-primary has-[:checked]:ring-1 ring-primary transition-all duration-300">
                <input type="radio" name="method" className="sr-only" />
                <div className="flex-1">
                  <h4 className="font-bold font-sans text-lg mb-2">Auto-detect M&E</h4>
                  <p className="text-muted text-sm mb-4">Athar dynamically evaluates the data inputs and selects the most appropriate evaluation methodology to generate MEAL insights.</p>
                  <span className="font-mono text-label bg-background px-2 py-1 rounded inline-block text-primary">MIXED FORMAT</span>
                </div>
              </label>
           </div>
        </div>
      </div>
    </section>
  );
};

const TrustPrivacy = ({ isRtl }) => {
  const manifestoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.manifesto-text', {
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: 'top 70%'
        },
        y: 30, opacity: 0, stagger: 0.2, duration: 1, ease: 'power3.out'
      });
    }, manifestoRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-surface py-[clamp(80px,10vw,140px)] px-4" dir="auto">
      <div className="max-w-[1120px] mx-auto">
         {/* Manifesto Portion */}
         <div ref={manifestoRef} className="mb-24 text-center max-w-4xl mx-auto">
            <p className="manifesto-text text-xl font-sans text-muted mb-6">{isRtl ? 'معظم تقنيات الذكاء الاصطناعي تركز على: تدريب النماذج على بياناتك.' : 'Most tech focuses on: training models on your data.'}</p>
            <h2 className="manifesto-text text-[clamp(2rem,4vw,3.5rem)] font-serif italic text-dark leading-tight">
               {isRtl ? 'نحن نركز على: الحفاظ على ' : 'We focus on: keeping beneficiaries\' '}
               <span className="text-accent not-italic">{isRtl ? 'قصص المستفيدين' : 'stories'}</span>
               {isRtl ? ' في أيدٍ أمينة.' : ' safe.'}
            </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left rtl:text-right border-t border-border pt-16 relative">
            <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=10&w=2000')] opacity-[0.03] bg-cover bg-center parallax-bg"></div>
            
            <div className="relative z-10 border-s-2 border-primary ps-6">
               <Shield className="w-8 h-8 text-primary mb-4" />
               <h3 className="font-sans font-bold text-h3 mb-3">{isRtl ? 'صفر احتفاظ بالبيانات' : 'Zero retention'}</h3>
               <p className="text-muted text-sm leading-relaxed">{isRtl ? 'تتم معالجة الملفات وحذفها فوراً. لا تخزين. لا سجلات حفظ.' : 'Files are processed and deleted immediately. No storage. No logs.'}</p>
            </div>

            <div className="relative z-10 border-s-2 border-primary ps-6">
               <Lock className="w-8 h-8 text-primary mb-4" />
               <h3 className="font-sans font-bold text-h3 mb-3">{isRtl ? 'لا للتدريب الآلي' : 'No AI training'}</h3>
               <p className="text-muted text-sm leading-relaxed">{isRtl ? 'بياناتك لن تحسن أي نموذج ذكاء اصطناعي. أبداً.' : 'Your data never improves any AI model. Ever.'}</p>
            </div>

            <div className="relative z-10 border-s-2 border-primary ps-6">
               <FileText className="w-8 h-8 text-primary mb-4" />
               <h3 className="font-sans font-bold text-h3 mb-3">{isRtl ? 'متوافق مع GDPR' : 'GDPR-aligned'}</h3>
               <p className="text-muted text-sm leading-relaxed">{isRtl ? 'اتفاقيات معالجة البيانات (DPA) متاحة للمؤسسات والمنظمات.' : 'Data Processing Agreements (DPA) available for institutions.'}</p>
            </div>
         </div>
         <div className="text-center mt-16 font-mono text-h3 uppercase text-dark">
            {isRtl ? 'البيانات تُعالج وتُحذف فوراً. مُوثوق بقرار نهائي.' : 'Files are processed and deleted immediately. Verified.'}
         </div>
      </div>
    </section>
  );
};

const SocialProof = ({ isRtl }) => {
  return (
    <section className="bg-background py-[clamp(80px,10vw,140px)] px-4" dir="auto">
      <div className="max-w-[700px] mx-auto text-left rtl:text-right">
        <div className="text-muted font-mono text-label mb-8 uppercase tracking-widest">{isRtl ? 'من الميدان' : 'From the field'}</div>
        <blockquote className="border-s-4 border-accent ps-8 py-2 mb-12">
           <p className="font-serif italic text-h2 text-dark mb-6 leading-tight">
             "Athar cut our quarterly reporting time by four entire days. Being able to run thematic extraction across Arabic FGDs in minutes without compromising data security is unheard of."
           </p>
           <footer className="font-sans">
             <div className="font-bold text-lg text-primary">Sarah M.</div>
             <div className="text-muted text-sm">MEAL Manager, IRC Jordan</div>
             <div className="text-xs text-muted/60 mt-2 italic flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent/80" /> Previously used: Excel + NVivo
             </div>
           </footer>
        </blockquote>
      </div>
    </section>
  );
};

const Pricing = ({ isRtl }) => {
  return (
    <section id="pricing" className="py-[clamp(80px,10vw,140px)] bg-surface px-4" dir="auto">
       <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-h2 font-serif mb-4">{isRtl ? 'ابدأ مجاناً. وتوسع عند الحاجة.' : 'Start free. Scale when it matters.'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
             {/* Base */}
             <div className="bg-white rounded-[2rem] border border-border p-8 flex flex-col shadow-sm">
                <h3 className="font-bold text-xl mb-2 font-mono uppercase tracking-wider text-muted">Free</h3>
                <div className="text-4xl font-serif font-bold mb-6">$0<span className="text-base text-muted font-sans font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> 3 analyses/month</li>
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> EN only</li>
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> Basic output formats</li>
                </ul>
                <button className="w-full py-3 rounded-full border-2 border-border text-dark font-bold hover:border-primary transition-colors">Current Plan</button>
             </div>

             {/* Pro */}
             <div className="bg-white rounded-[2rem] border-2 border-accent p-8 flex flex-col shadow-xl md:-translate-y-4 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest block whitespace-nowrap">Recommended</div>
                <h3 className="font-bold text-xl mb-2 font-mono uppercase tracking-wider text-primary">Pro</h3>
                <div className="text-4xl font-serif font-bold mb-6">$24<span className="text-base text-muted font-sans font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex gap-3 text-sm text-dark font-semibold"><Check className="w-5 h-5 text-primary shrink-0" /> Unlimited analyses</li>
                  <li className="flex gap-3 text-sm text-dark font-semibold"><Check className="w-5 h-5 text-primary shrink-0" /> EN + AR bilingual support</li>
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> All 3 output formats</li>
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-accent shrink-0" /> Logframe alignment</li>
                </ul>
                <a href="#waitlist" className="w-full py-4 text-center rounded-full bg-accent text-dark font-bold shadow-md hover:scale-[1.03] transition-transform">Join Waitlist</a>
             </div>

             {/* Enterprise */}
             <div className="bg-white rounded-[2rem] border border-border p-8 flex flex-col shadow-sm">
                <h3 className="font-bold text-xl mb-2 font-mono uppercase tracking-wider text-muted">Institutional</h3>
                <div className="text-4xl font-serif font-bold mb-6">$349<span className="text-base text-muted font-sans font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> 10 seats included</li>
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> Priority processing</li>
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> Dedicated DPA agreement</li>
                  <li className="flex gap-3 text-sm text-dark"><Check className="w-5 h-5 text-primary shrink-0" /> Custom MEAL formats</li>
                </ul>
                <button className="w-full py-3 rounded-full border border-border text-dark font-bold hover:bg-dark hover:text-white transition-colors">Contact Sales</button>
             </div>
          </div>
          <div className="mt-8 text-center">
             <a href="#" className="text-sm text-muted hover:text-primary underline underline-offset-4">{isRtl ? 'هل تمول منظمتك عبر منح؟ اسألنا عن الأسعار المخفضة.' : 'NGO grant-funded? Ask us about reduced rates.'}</a>
          </div>
       </div>
    </section>
  );
};

const Waitlist = ({ isRtl }) => {
  return (
    <section id="waitlist" className="py-[clamp(100px,12vw,160px)] bg-background px-4 relative flex justify-center items-center overflow-hidden" dir="auto">
      <div className="absolute inset-0 bg-dark/5"></div>
      <div className="max-w-[700px] w-full mx-auto relative z-10 text-center">
         <h2 className="text-h2 font-serif text-dark mb-8 leading-tight">
            {isRtl ? 'أثر يُطلق قريبًا لمجموعة محددة من محترفي التقييم والمتابعة.' : 'Athar launches to a limited cohort of MEAL professionals.'}
         </h2>
         <form className="bg-white p-8 rounded-[2rem] shadow-xl border border-border/50 text-left rtl:text-right">
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 cursor-pointer" htmlFor="email">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input type="email" id="email" className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent" required />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-bold mb-2 cursor-pointer" htmlFor="dataType">{isRtl ? 'ما هو أكثر نوع بيانات تحلله؟' : 'What do you analyze most?'}</label>
              <select id="dataType" className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent appearance-none" required>
                 <option value="" disabled selected>{isRtl ? 'اختر بناءً على عملك...' : 'Select your primary data type...'}</option>
                 <option value="ssi">SSI Transcripts</option>
                 <option value="fgd">FGD Notes</option>
                 <option value="excel">Excel Response Sheets</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-accent text-dark font-bold text-lg py-4 rounded-xl shadow-md hover:scale-[1.02] transition-transform">
               {isRtl ? 'احجز مكاني' : 'Reserve my spot'}
            </button>
            <div className="mt-6 text-sm text-muted text-center leading-relaxed">
               {isRtl ? 'لا بطاقة ائتمان. لا التزام. أول 100 منضم سيحصلون على 6 أشهر مجانية على خطة Pro.' : 'No credit card. No commitment. First 100 waitlist members get 6 months Pro free.'}
            </div>
         </form>
         <div className="mt-6 text-xs text-muted opacity-80 max-w-[400px] mx-auto italic">
            "We will not share your email or use it to train any model."
         </div>
      </div>
    </section>
  );
};

const Footer = ({ isRtl }) => {
  return (
    <footer className="bg-dark text-white rounded-t-[4rem] px-8 py-16 pb-8" dir="auto">
      <div className="max-w-[1120px] mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
               <div className="text-3xl font-bold font-sans flex items-center gap-2 mb-4">
                  <span>Athar</span>
                  <span className="font-arabic">أثر</span>
               </div>
               <p className="text-white/60 max-w-sm font-serif italic section-sub">
                  Built by a MEAL practitioner, for MEAL practitioners.
               </p>
               <div className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/50">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]"></span> System Operational
               </div>
            </div>
            
            <div>
               <h4 className="font-bold mb-4 uppercase tracking-widest text-sm text-white/40">Product</h4>
               <ul className="space-y-3">
                 <li><a href="#how-it-works" className="text-white/80 hover:text-accent transition-colors">How it works</a></li>
                 <li><a href="#methodology" className="text-white/80 hover:text-accent transition-colors">Methodology</a></li>
                 <li><a href="#pricing" className="text-white/80 hover:text-accent transition-colors">Pricing</a></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold mb-4 uppercase tracking-widest text-sm text-white/40">Legal</h4>
               <ul className="space-y-3">
                 <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Privacy</a></li>
                 <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Terms</a></li>
                 <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Data Processing Agreement</a></li>
                 <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Contact</a></li>
               </ul>
            </div>
         </div>
         <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40 uppercase tracking-widest">
            <div>&copy; {new Date().getFullYear()} Athar Platform. All rights reserved.</div>
            <div>Zero Retention Architecture</div>
         </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = isRtl ? 'ar' : 'en';
  }, [isRtl]);

  const toggleLang = () => setIsRtl(!isRtl);

  return (
    <div className="min-h-screen bg-background font-sans max-w-[100vw] overflow-x-hidden">
      <Navbar toggleLang={toggleLang} isRtl={isRtl} />
      <Hero isRtl={isRtl} />
      <Features isRtl={isRtl} />
      <Protocol isRtl={isRtl} />
      <MethodologySection isRtl={isRtl} />
      <TrustPrivacy isRtl={isRtl} />
      <SocialProof isRtl={isRtl} />
      <Pricing isRtl={isRtl} />
      <Waitlist isRtl={isRtl} />
      <Footer isRtl={isRtl} />
    </div>
  );
}
