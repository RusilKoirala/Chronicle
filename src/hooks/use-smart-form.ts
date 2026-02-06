/**
 * Custom hook for smart forms with auto-save, autocomplete, and smart defaults
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  recordFieldHistory,
  getAutocompleteSuggestions,
  getSmartDefaults,
  debounce,
  SmartDefaultContext,
} from '@/lib/form-utils';

export interface UseSmartFormOptions<T> {
  formId: string;
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  enableDraftSaving?: boolean;
  draftSaveDelay?: number;
  enableAutocomplete?: boolean;
  smartDefaults?: Record<string, () => any>;
  context?: Partial<SmartDefaultContext>;
}

export interface UseSmartFormReturn<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  hasDraft: boolean;
  
  // Field operations
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  
  // Form operations
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  loadDraftValues: () => void;
  clearDraftValues: () => void;
  
  // Autocomplete
  getFieldSuggestions: (field: keyof T, query?: string) => string[];
}

export function useSmartForm<T extends Record<string, any>>({
  formId,
  initialValues = {},
  onSubmit,
  enableDraftSaving = true,
  draftSaveDelay = 1000,
  enableAutocomplete = true,
  smartDefaults = {},
  context = {},
}: UseSmartFormOptions<T>): UseSmartFormReturn<T> {
  // Apply smart defaults to initial values
  const defaultContext: SmartDefaultContext = {
    formId,
    ...context,
  };
  
  const computedDefaults = getSmartDefaults(defaultContext, smartDefaults);
  const mergedInitialValues = { ...computedDefaults, ...initialValues };
  
  const [values, setValuesState] = useState<Partial<T>>(mergedInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  
  const initialValuesRef = useRef(mergedInitialValues);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  
  // Check for existing draft on mount
  useEffect(() => {
    if (enableDraftSaving) {
      const draft = loadDraft(formId);
      if (draft && Object.keys(draft.data).length > 0) {
        setHasDraft(true);
      }
    }
  }, [formId, enableDraftSaving]);
  
  // Auto-save draft with debounce
  const saveDraftDebounced = useCallback(
    debounce((data: Partial<T>) => {
      if (enableDraftSaving && isDirty) {
        saveDraft(formId, data);
      }
    }, draftSaveDelay),
    [formId, enableDraftSaving, draftSaveDelay, isDirty]
  );
  
  useEffect(() => {
    if (enableDraftSaving && isDirty) {
      saveDraftDebounced(values);
    }
  }, [values, enableDraftSaving, isDirty, saveDraftDebounced]);
  
  // Set single field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is modified
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);
  
  // Set multiple values
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);
  
  // Set field error
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);
  
  // Set field touched
  const setTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouchedState(prev => ({ ...prev, [field as string]: isTouched }));
  }, []);
  
  // Get autocomplete suggestions for a field
  const getFieldSuggestions = useCallback((field: keyof T, query?: string): string[] => {
    if (!enableAutocomplete) return [];
    return getAutocompleteSuggestions(formId, field as string, query);
  }, [formId, enableAutocomplete]);
  
  // Load draft values
  const loadDraftValues = useCallback(() => {
    const draft = loadDraft(formId);
    if (draft) {
      setValuesState(draft.data as Partial<T>);
      setHasDraft(false);
    }
  }, [formId]);
  
  // Clear draft values
  const clearDraftValues = useCallback(() => {
    clearDraft(formId);
    setHasDraft(false);
  }, [formId]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setIsSubmitting(true);
    
    try {
      // Record field history for autocomplete
      if (enableAutocomplete) {
        for (const [field, value] of Object.entries(values)) {
          if (typeof value === 'string' && value.trim()) {
            recordFieldHistory(formId, field, value);
          }
        }
      }
      
      // Call onSubmit handler
      await onSubmit(values as T);
      
      // Clear draft after successful submission
      if (enableDraftSaving) {
        clearDraft(formId);
        setHasDraft(false);
      }
      
      // Reset form state
      initialValuesRef.current = values;
      setErrors({});
      setTouchedState({});
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, formId, enableDraftSaving, enableAutocomplete]);
  
  // Handle form reset
  const handleReset = useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrors({});
    setTouchedState({});
    
    if (enableDraftSaving) {
      clearDraft(formId);
      setHasDraft(false);
    }
  }, [formId, enableDraftSaving]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    hasDraft,
    
    setValue,
    setValues,
    setError,
    setTouched,
    
    handleSubmit,
    handleReset,
    loadDraftValues,
    clearDraftValues,
    
    getFieldSuggestions,
  };
}
