/**
 * Form utilities for smart defaults, autocomplete, and draft saving
 */

import { storage } from './storage';

// Storage keys for form drafts and history
const FORM_DRAFT_PREFIX = 'form_draft_';
const FORM_HISTORY_PREFIX = 'form_history_';

export interface FormDraft {
  formId: string;
  data: Record<string, any>;
  timestamp: number;
}

export interface FormHistoryEntry {
  field: string;
  value: string;
  frequency: number;
  lastUsed: number;
}

/**
 * Save form draft to local storage
 */
export function saveDraft(formId: string, data: Record<string, any>): void {
  try {
    const draft: FormDraft = {
      formId,
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${FORM_DRAFT_PREFIX}${formId}`, JSON.stringify(draft));
  } catch (error) {
    console.error('Error saving form draft:', error);
  }
}

/**
 * Load form draft from local storage
 */
export function loadDraft(formId: string): FormDraft | null {
  try {
    const stored = localStorage.getItem(`${FORM_DRAFT_PREFIX}${formId}`);
    if (!stored) return null;
    
    const draft: FormDraft = JSON.parse(stored);
    
    // Clear drafts older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    if (draft.timestamp < sevenDaysAgo) {
      clearDraft(formId);
      return null;
    }
    
    return draft;
  } catch (error) {
    console.error('Error loading form draft:', error);
    return null;
  }
}

/**
 * Clear form draft from local storage
 */
export function clearDraft(formId: string): void {
  try {
    localStorage.removeItem(`${FORM_DRAFT_PREFIX}${formId}`);
  } catch (error) {
    console.error('Error clearing form draft:', error);
  }
}

/**
 * Record field value in history for autocomplete
 */
export function recordFieldHistory(formId: string, field: string, value: string): void {
  if (!value || !value.trim()) return;
  
  try {
    const key = `${FORM_HISTORY_PREFIX}${formId}_${field}`;
    const stored = localStorage.getItem(key);
    const history: Record<string, FormHistoryEntry> = stored ? JSON.parse(stored) : {};
    
    const normalizedValue = value.trim();
    
    if (history[normalizedValue]) {
      history[normalizedValue].frequency += 1;
      history[normalizedValue].lastUsed = Date.now();
    } else {
      history[normalizedValue] = {
        field,
        value: normalizedValue,
        frequency: 1,
        lastUsed: Date.now(),
      };
    }
    
    localStorage.setItem(key, JSON.stringify(history));
  } catch (error) {
    console.error('Error recording field history:', error);
  }
}

/**
 * Get autocomplete suggestions for a field
 */
export function getAutocompleteSuggestions(
  formId: string,
  field: string,
  query: string = '',
  limit: number = 5
): string[] {
  try {
    const key = `${FORM_HISTORY_PREFIX}${formId}_${field}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    const history: Record<string, FormHistoryEntry> = JSON.parse(stored);
    const entries = Object.values(history);
    
    // Filter by query if provided
    const filtered = query
      ? entries.filter(entry => 
          entry.value.toLowerCase().includes(query.toLowerCase())
        )
      : entries;
    
    // Sort by frequency and recency
    const sorted = filtered.sort((a, b) => {
      // Prioritize frequency
      if (a.frequency !== b.frequency) {
        return b.frequency - a.frequency;
      }
      // Then by recency
      return b.lastUsed - a.lastUsed;
    });
    
    return sorted.slice(0, limit).map(entry => entry.value);
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error);
    return [];
  }
}

/**
 * Generate smart defaults based on context and history
 */
export interface SmartDefaultContext {
  formId: string;
  currentPage?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: number; // 0-6
  recentActivity?: string[];
}

export function getSmartDefaults(
  context: SmartDefaultContext,
  fieldDefaults: Record<string, () => any>
): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  // Apply field-specific default generators
  for (const [field, generator] of Object.entries(fieldDefaults)) {
    try {
      defaults[field] = generator();
    } catch (error) {
      console.error(`Error generating default for field ${field}:`, error);
    }
  }
  
  // Load most recent values from history as additional defaults
  for (const field of Object.keys(fieldDefaults)) {
    if (defaults[field] === undefined || defaults[field] === null || defaults[field] === '') {
      const suggestions = getAutocompleteSuggestions(context.formId, field, '', 1);
      if (suggestions.length > 0) {
        defaults[field] = suggestions[0];
      }
    }
  }
  
  return defaults;
}

/**
 * Get appropriate HTML input type for mobile optimization
 */
export function getMobileInputType(fieldName: string, fieldType?: string): string {
  if (fieldType) return fieldType;
  
  const lowerField = fieldName.toLowerCase();
  
  if (lowerField.includes('email')) return 'email';
  if (lowerField.includes('phone') || lowerField.includes('tel')) return 'tel';
  if (lowerField.includes('url') || lowerField.includes('link') || lowerField.includes('website')) return 'url';
  if (lowerField.includes('date')) return 'date';
  if (lowerField.includes('time')) return 'time';
  if (lowerField.includes('number') || lowerField.includes('age') || lowerField.includes('count')) return 'number';
  if (lowerField.includes('search')) return 'search';
  
  return 'text';
}

/**
 * Debounce function for auto-save
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Clean up old drafts and history
 */
export function cleanupFormStorage(): void {
  try {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Clean up drafts
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(FORM_DRAFT_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const draft: FormDraft = JSON.parse(stored);
          if (draft.timestamp < sevenDaysAgo) {
            localStorage.removeItem(key);
          }
        }
      }
    }
    
    // Clean up old history entries (keep only last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(FORM_HISTORY_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const history: Record<string, FormHistoryEntry> = JSON.parse(stored);
          const filtered = Object.fromEntries(
            Object.entries(history).filter(([_, entry]) => entry.lastUsed >= thirtyDaysAgo)
          );
          
          if (Object.keys(filtered).length === 0) {
            localStorage.removeItem(key);
          } else if (Object.keys(filtered).length !== Object.keys(history).length) {
            localStorage.setItem(key, JSON.stringify(filtered));
          }
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up form storage:', error);
  }
}
