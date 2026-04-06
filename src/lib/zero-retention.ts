import React from 'react';

/**
 * Zero-Retention Guard: Ensures extracted data is cleared
 * immediately after being passed down the pipeline.
 */
export const ZeroRetentionGuard = {
  /**
   * Clears the raw text buffer from React state.
   * Uses a timeout for reliable state clearance.
   */
  clearTextBuffer(setter: (v: string) => void): void {
    setter('');
    // Double-tap to ensure no lingering references
    setTimeout(() => setter(''), 0);
  },
  
  /**
   * Verifies the API route body for security compliance.
   * Throws if an entire file object reached the server level.
   */
  assertNoFile(body: any): void {
    const forbiddenKeys = ['file', 'fileData', 'blob', 'buffer'];
    const foundViolation = forbiddenKeys.some(key => key in body);
    
    if (foundViolation) {
      throw new Error(
        'Security violation: Direct file object in API request body. ' +
        'Analysis must only proceed on extracted text strings.'
      );
    }
  }
};

/**
 * Legacy support for simple buffer clearing
 */
export function clearBuffer(
  setter: React.Dispatch<React.SetStateAction<string>>
): void {
  ZeroRetentionGuard.clearTextBuffer(setter);
}
