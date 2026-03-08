/**
 * Session management utilities
 * Handles anonymous session ID generation and storage
 */

/**
 * Generate a unique anonymous session ID
 * Format: SAH-XXXXXXXX (8 random alphanumeric characters)
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `SAH-${timestamp}${randomStr}`.toUpperCase().substring(0, 12);
}

/**
 * Get current session ID from localStorage
 */
export function getSessionId(): string | null {
  return localStorage.getItem('sessionId');
}

/**
 * Save session ID to localStorage
 */
export function saveSessionId(sessionId: string): void {
  localStorage.setItem('sessionId', sessionId);
}

/**
 * Clear session ID from localStorage
 */
export function clearSessionId(): void {
  localStorage.removeItem('sessionId');
}

/**
 * Check if a valid session exists
 */
export function hasActiveSession(): boolean {
  const sessionId = getSessionId();
  return sessionId !== null && sessionId.length > 0;
}
