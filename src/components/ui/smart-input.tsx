/**
 * Smart input component with autocomplete suggestions
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface SmartInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: string[];
  onSuggestionSelect?: (value: string) => void;
  showSuggestionsOnFocus?: boolean;
}

export function SmartInput({
  suggestions = [],
  onSuggestionSelect,
  showSuggestionsOnFocus = false,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  ...props
}: SmartInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Filter suggestions based on current value
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (!value || typeof value !== 'string') return true;
    return suggestion.toLowerCase().includes(value.toLowerCase());
  });
  
  const hasSuggestions = filteredSuggestions.length > 0;
  
  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (showSuggestionsOnFocus && hasSuggestions) {
      setShowSuggestions(true);
    }
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
    onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (hasSuggestions && e.target.value) {
      setShowSuggestions(true);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || !hasSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectSuggestion(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };
  
  const selectSuggestion = (suggestion: string) => {
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };
  
  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
      
      {showSuggestions && hasSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between",
                index === selectedIndex && "bg-accent text-accent-foreground"
              )}
            >
              <span>{suggestion}</span>
              {value === suggestion && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
