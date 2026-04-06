import React, { useState, useRef, KeyboardEvent } from 'react';
import styles from './MethodSelector.module.css';
import { MethodologyId } from '../../types/methodology';
import { METHODOLOGIES, getSystemPromptKey } from '../../lib/methodology-router';
import { AlertCircle } from 'lucide-react';

export default function MethodSelector() {
  const [selectedMethod, setSelectedMethod] = useState<MethodologyId | null>(null);
  const [validationError, setValidationError] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSelect = (id: MethodologyId) => {
    setSelectedMethod(id);
    setValidationError(false);
  };

  const attemptProceed = () => {
    if (!selectedMethod) {
      setValidationError(true);
      return;
    }
    
    // In a real flow, this passes the selected prompt key to the next module
    const promptKey = getSystemPromptKey(selectedMethod);
    // Zero-retention: no logging of user selections
    alert(`Methodology Locked: ${selectedMethod}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number, id: MethodologyId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(id);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % METHODOLOGIES.length;
      cardRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + METHODOLOGIES.length) % METHODOLOGIES.length;
      cardRefs.current[prev]?.focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {METHODOLOGIES.map((method, index) => {
          const isSelected = selectedMethod === method.id;
          
          return (
            <div
              key={method.id}
              ref={el => { cardRefs.current[index] = el; }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => handleSelect(method.id)}
              onKeyDown={(e) => handleKeyDown(e, index, method.id)}
            >
              <div 
                className={`${styles.badge} ${method.isPopular ? styles.badgePopular : ''}`}
              >
                {method.badgeLabel}
              </div>
              <h3 className={styles.name}>{method.name}</h3>
              <p className={styles.description}>{method.description}</p>
              <div className={styles.output}>
                OUTPUT: {method.outputFormat}
              </div>
            </div>
          );
        })}
      </div>
      
      {validationError && (
        <div className={styles.validationError} role="alert">
          <AlertCircle size={16} />
          Please select a methodology before proceeding.
        </div>
      )}

      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
         <button 
           onClick={attemptProceed}
           style={{
             backgroundColor: 'oklch(32% 0.08 195)', 
             color: 'white',
             padding: '1rem 2.5rem',
             borderRadius: '999px',
             fontWeight: 'bold',
             border: 'none',
             cursor: 'pointer',
             transition: 'transform 200ms ease-out',
             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
         >
           Confirm Methodology
         </button>
      </div>
    </div>
  );
}
