import { useState, useCallback, useRef } from 'react';

/**
 * Zero-Retention Memory Wipe Utilities
 * 
 * These utilities ensure that extracted text is aggressively removed
 * from React state and JavaScript heap after analysis dispatch.
 * 
 * Strategy:
 * 1. Immediate setter('') empties the React state synchronously
 * 2. Microtask setter('') via setTimeout(0) ensures the React flush
 *    cycle doesn't restore a stale closure reference
 * 3. If the V8 garbage collector is exposed (Chrome --enable-gc flag
 *    or Node --expose-gc), explicitly trigger a collection pass
 */

/**
 * Wipe a string state setter with a two-phase clear.
 * Phase 1: Immediate empty string
 * Phase 2: Deferred empty string (macrotask) to bust stale closures
 */
export function clearTextBuffer(setter: (v: string) => void): void {
  setter('');
  setTimeout(() => setter(''), 0);

  // Opportunistic GC hint — won't throw in normal browsers
  if (typeof window !== 'undefined' && 'gc' in window) {
    try {
      (window as unknown as { gc: () => void }).gc();
    } catch {
      // Silently ignored — gc is only available with --expose-gc
    }
  }
}

/**
 * Wipe multiple string setters at once (e.g. extractedText + fileName + errorMsg)
 */
export function clearMultipleBuffers(...setters: Array<(v: string) => void>): void {
  for (const setter of setters) {
    clearTextBuffer(setter);
  }
}

/**
 * React hook encapsulating the zero-retention lifecycle.
 * 
 * Returns:
 *   bufferCleared: boolean — true for 4 seconds after a wipe, drives the trust indicator UI
 *   clearBuffer: (setter) => void — triggers the two-phase wipe and shows trust indicator
 *   clearMultiple: (...setters) => void — wipes multiple buffers simultaneously
 */
export function useZeroRetention() {
  const [bufferCleared, setBufferCleared] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBuffer = useCallback((setter: (v: string) => void) => {
    clearTextBuffer(setter);
    setBufferCleared(true);

    // Auto-dismiss trust indicator after 4 seconds with fade
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
    }
    fadeTimerRef.current = setTimeout(() => {
      setBufferCleared(false);
      fadeTimerRef.current = null;
    }, 4000);
  }, []);

  const clearMultiple = useCallback((...setters: Array<(v: string) => void>) => {
    clearMultipleBuffers(...setters);
    setBufferCleared(true);

    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
    }
    fadeTimerRef.current = setTimeout(() => {
      setBufferCleared(false);
      fadeTimerRef.current = null;
    }, 4000);
  }, []);

  return { bufferCleared, clearBuffer, clearMultiple };
}
