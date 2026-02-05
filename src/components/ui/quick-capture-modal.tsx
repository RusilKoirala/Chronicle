'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { MobileForm, MobileFormField, MobileFormButtons, MobileTextarea } from "./mobile-form";
import { MobileInput } from "./mobile-input";
import { Button } from "./button";
import { useDeviceDetection } from "@/hooks/use-device-detection";
import { 
  Plus, 
  FileText, 
  Target, 
  CheckCircle, 
  BookOpen, 
  RotateCcw,
  Calendar,
  Tag,
  Link as LinkIcon,
  Loader2,
  Check,
  X
} from "lucide-react";

// Quick capture types
export type QuickCaptureType = 'task' | 'resource' | 'achievement' | 'goal' | 'routine';

interface QuickCaptureData {
  type: QuickCaptureType;
  subtype?: string;
  title: string;
  description?: string;
  url?: string;
  tags?: string[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  points?: number;
}

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: QuickCaptureType;
  initialData?: Partial<QuickCaptureData>;
  onSave: (data: QuickCaptureData) => Promise<void>;
  className?: string;
}

// Smart defaults based on context and history
function useSmartDefaults(type: QuickCaptureType, subtype?: string) {
  return React.useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const defaults: Partial<QuickCaptureData> = {
      type,
      subtype,
    };
    
    switch (type) {
      case 'task':
        return {
          ...defaults,
          priority: 'medium' as const,
          dueDate: tomorrow.toISOString().split('T')[0], // Tomorrow as default
        };
        
      case 'resource':
        return {
          ...defaults,
          category: subtype === 'note' ? 'Notes' : 'General',
        };
        
      case 'achievement':
        return {
          ...defaults,
          points: 10, // Default points
          category: 'Personal',
        };
        
      case 'goal':
        return {
          ...defaults,
          priority: 'medium' as const,
        };
        
      case 'routine':
        return {
          ...defaults,
          category: 'Daily',
        };
        
      default:
        return defaults;
    }
  }, [type, subtype]);
}

// Form validation
function validateQuickCaptureData(data: Partial<QuickCaptureData>): string[] {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (data.type === 'resource' && data.url && !isValidUrl(data.url)) {
    errors.push('Please enter a valid URL');
  }
  
  if (data.type === 'achievement' && data.points && data.points < 0) {
    errors.push('Points must be positive');
  }
  
  return errors;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Auto-detect resource type from URL
function detectResourceType(url: string): string {
  if (!url) return 'General';
  
  const domain = new URL(url).hostname.toLowerCase();
  
  if (domain.includes('youtube.com') || domain.includes('youtu.be')) return 'Video';
  if (domain.includes('github.com')) return 'Code';
  if (domain.includes('medium.com') || domain.includes('dev.to')) return 'Article';
  if (domain.includes('twitter.com') || domain.includes('x.com')) return 'Social';
  if (domain.includes('linkedin.com')) return 'Professional';
  if (domain.includes('stackoverflow.com')) return 'Technical';
  
  return 'General';
}

const QuickCaptureModal = React.forwardRef<HTMLDivElement, QuickCaptureModalProps>(
  ({ isOpen, onClose, initialType = 'task', initialData, onSave, className }, ref) => {
    const { isMobileApp } = useDeviceDetection();
    const smartDefaults = useSmartDefaults(initialType, initialData?.subtype);
    
    // Form state
    const [formData, setFormData] = React.useState<Partial<QuickCaptureData>>({
      ...smartDefaults,
      ...initialData,
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<string[]>([]);
    const [showSuccess, setShowSuccess] = React.useState(false);
    
    // Auto-detect resource type when URL changes
    React.useEffect(() => {
      if (formData.type === 'resource' && formData.url) {
        const detectedType = detectResourceType(formData.url);
        setFormData(prev => ({ ...prev, category: detectedType }));
      }
    }, [formData.url, formData.type]);
    
    // Reset form when modal opens/closes
    React.useEffect(() => {
      if (isOpen) {
        setFormData({ ...smartDefaults, ...initialData });
        setErrors([]);
        setShowSuccess(false);
      }
    }, [isOpen, smartDefaults, initialData]);
    
    const handleInputChange = (field: keyof QuickCaptureData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear errors when user starts typing
      if (errors.length > 0) {
        setErrors([]);
      }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const validationErrors = validateQuickCaptureData(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      setIsLoading(true);
      setErrors([]);
      
      try {
        await onSave(formData as QuickCaptureData);
        
        // Show success feedback
        setShowSuccess(true);
        
        // Auto-close after success animation
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
        }, 1000);
        
      } catch (error) {
        setErrors(['Failed to save. Please try again.']);
      } finally {
        setIsLoading(false);
      }
    };
    
    const getTypeIcon = (type: QuickCaptureType) => {
      switch (type) {
        case 'task': return <Plus className="h-5 w-5" />;
        case 'resource': return <BookOpen className="h-5 w-5" />;
        case 'achievement': return <CheckCircle className="h-5 w-5" />;
        case 'goal': return <Target className="h-5 w-5" />;
        case 'routine': return <RotateCcw className="h-5 w-5" />;
        default: return <Plus className="h-5 w-5" />;
      }
    };
    
    const getTypeTitle = (type: QuickCaptureType) => {
      switch (type) {
        case 'task': return 'Quick Task';
        case 'resource': return 'Save Resource';
        case 'achievement': return 'Log Achievement';
        case 'goal': return 'Set Goal';
        case 'routine': return 'Create Routine';
        default: return 'Quick Add';
      }
    };
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          ref={ref}
          className={cn(
            "sm:max-w-md w-full mx-4",
            isMobileApp && "max-h-[90vh] overflow-y-auto",
            showSuccess && "border-success/50 bg-success/5",
            className
          )}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              {showSuccess ? (
                <>
                  <Check className="h-5 w-5 text-success" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  {getTypeIcon(formData.type!)}
                  {getTypeTitle(formData.type!)}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {showSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-success" />
              </div>
              <p className="text-muted-foreground">
                Your {formData.type} has been saved successfully!
              </p>
            </div>
          ) : (
            <MobileForm onSubmit={handleSubmit} variant="modal" spacing="normal">
              {/* Title Field */}
              <MobileFormField
                label="Title"
                required
                errorText={errors.find(e => e.includes('Title'))}
              >
                <MobileInput
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={`Enter ${formData.type} title...`}
                  autoFocus
                  maxLength={100}
                />
              </MobileFormField>
              
              {/* URL Field for Resources */}
              {formData.type === 'resource' && (
                <MobileFormField
                  label="URL or Link"
                  helperText="Optional - paste a link to save"
                  errorText={errors.find(e => e.includes('URL'))}
                >
                  <MobileInput
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder="https://example.com"
                    leftIcon={<LinkIcon className="h-4 w-4" />}
                  />
                </MobileFormField>
              )}
              
              {/* Description Field */}
              <MobileFormField
                label="Description"
                helperText="Optional - add more details"
              >
                <MobileTextarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={`Describe your ${formData.type}...`}
                  rows={3}
                  maxLength={500}
                  autoResize
                />
              </MobileFormField>
              
              {/* Due Date for Tasks and Goals */}
              {(formData.type === 'task' || formData.type === 'goal') && (
                <MobileFormField
                  label="Due Date"
                  helperText="When should this be completed?"
                >
                  <MobileInput
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    leftIcon={<Calendar className="h-4 w-4" />}
                  />
                </MobileFormField>
              )}
              
              {/* Priority for Tasks and Goals */}
              {(formData.type === 'task' || formData.type === 'goal') && (
                <MobileFormField
                  label="Priority"
                  helperText="How important is this?"
                >
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <Button
                        key={priority}
                        type="button"
                        variant={formData.priority === priority ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('priority', priority)}
                        className="flex-1 capitalize"
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </MobileFormField>
              )}
              
              {/* Points for Achievements */}
              {formData.type === 'achievement' && (
                <MobileFormField
                  label="Points"
                  helperText="How many points is this worth?"
                  errorText={errors.find(e => e.includes('Points'))}
                >
                  <MobileInput
                    type="number"
                    value={formData.points || ''}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                    placeholder="10"
                    min="0"
                    max="1000"
                  />
                </MobileFormField>
              )}
              
              {/* Category/Tags */}
              <MobileFormField
                label="Category"
                helperText="Optional - organize your items"
              >
                <MobileInput
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Work, Personal, Learning..."
                  leftIcon={<Tag className="h-4 w-4" />}
                />
              </MobileFormField>
              
              {/* Error Display */}
              {errors.length > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <X className="h-4 w-4" />
                    <span className="font-medium">Please fix the following:</span>
                  </div>
                  <ul className="mt-1 text-sm text-destructive/80 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Form Buttons */}
              <MobileFormButtons variant="horizontal" align="stretch">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.title?.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </MobileFormButtons>
            </MobileForm>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

QuickCaptureModal.displayName = "QuickCaptureModal";

// Hook for managing quick capture modal
export function useQuickCapture() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [captureType, setCaptureType] = React.useState<QuickCaptureType>('task');
  const [initialData, setInitialData] = React.useState<Partial<QuickCaptureData>>();
  
  const open = React.useCallback((type: QuickCaptureType, data?: Partial<QuickCaptureData>) => {
    setCaptureType(type);
    setInitialData(data);
    setIsOpen(true);
  }, []);
  
  const close = React.useCallback(() => {
    setIsOpen(false);
    setInitialData(undefined);
  }, []);
  
  // Listen for custom events from contextual FAB
  React.useEffect(() => {
    const handleQuickCapture = (event: CustomEvent) => {
      const { type, ...data } = event.detail;
      open(type, data);
    };
    
    window.addEventListener('open-quick-capture', handleQuickCapture as EventListener);
    return () => window.removeEventListener('open-quick-capture', handleQuickCapture as EventListener);
  }, [open]);
  
  return {
    isOpen,
    captureType,
    initialData,
    open,
    close,
  };
}

// Quick capture provider for global state management
interface QuickCaptureContextType {
  isOpen: boolean;
  captureType: QuickCaptureType;
  initialData?: Partial<QuickCaptureData>;
  open: (type: QuickCaptureType, data?: Partial<QuickCaptureData>) => void;
  close: () => void;
  onSave: (data: QuickCaptureData) => Promise<void>;
}

const QuickCaptureContext = React.createContext<QuickCaptureContextType | null>(null);

interface QuickCaptureProviderProps {
  children: React.ReactNode;
  onSave: (data: QuickCaptureData) => Promise<void>;
}

export function QuickCaptureProvider({ children, onSave }: QuickCaptureProviderProps) {
  const quickCapture = useQuickCapture();
  
  const contextValue: QuickCaptureContextType = {
    ...quickCapture,
    onSave,
  };
  
  return (
    <QuickCaptureContext.Provider value={contextValue}>
      {children}
      <QuickCaptureModal
        isOpen={quickCapture.isOpen}
        onClose={quickCapture.close}
        initialType={quickCapture.captureType}
        initialData={quickCapture.initialData}
        onSave={onSave}
      />
    </QuickCaptureContext.Provider>
  );
}

export function useQuickCaptureContext() {
  const context = React.useContext(QuickCaptureContext);
  if (!context) {
    throw new Error('useQuickCaptureContext must be used within a QuickCaptureProvider');
  }
  return context;
}

export {
  QuickCaptureModal,
  validateQuickCaptureData,
  detectResourceType,
};

export type {
  QuickCaptureData,
  QuickCaptureModalProps,
};