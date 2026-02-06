/**
 * Inline edit component for lightweight editing without full forms
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Button } from './button';
import { Check, X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InlineEditProps {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  displayClassName?: string;
  editOnClick?: boolean;
  showEditIcon?: boolean;
  required?: boolean;
  maxLength?: number;
}

export function InlineEdit({
  value,
  onSave,
  onCancel,
  multiline = false,
  placeholder = 'Click to edit',
  className,
  displayClassName,
  editOnClick = true,
  showEditIcon = true,
  required = false,
  maxLength,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  useEffect(() => {
    setEditValue(value);
  }, [value]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleSave = async () => {
    if (required && !editValue.trim()) {
      return;
    }
    
    if (editValue === value) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving inline edit:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    onCancel?.();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && multiline && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };
  
  if (!isEditing) {
    return (
      <div
        className={cn(
          "group relative inline-flex items-center gap-2",
          editOnClick && "cursor-pointer hover:bg-accent/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors",
          className
        )}
        onClick={editOnClick ? () => setIsEditing(true) : undefined}
      >
        <span className={cn(
          "flex-1",
          !value && "text-muted-foreground italic",
          displayClassName
        )}>
          {value || placeholder}
        </span>
        {showEditIcon && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-start gap-2", className)}>
      {multiline ? (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          className="flex-1"
        />
      ) : (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1"
        />
      )}
      
      <div className="flex gap-1 pt-1">
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isSaving || (required && !editValue.trim())}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
