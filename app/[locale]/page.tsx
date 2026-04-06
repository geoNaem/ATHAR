import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
export const dynamic = 'force-dynamic';
import { 
  Problem, 
  Workflow, 
  Methodology, 
  Output, 
  Privacy, 
  Testimonial, 
  Field, 
  FinalCTA, 
  Footer 
} from '@/components/SectionStack';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Workflow />
      <Methodology />
      <Output />
      <Privacy />
      <Testimonial />
      <Field />
      <FinalCTA />
      <Footer />
      
      {/* Scroll Reveal Script */}
      <script dangerouslySetInnerHTML={{ __html: `
        const observerOptions = {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px"
        };
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        }, observerOptions);
        
        document.addEventListener('DOMContentLoaded', () => {
          document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        });
      `}} />
    </main>
  );
}
