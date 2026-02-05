'use client';

import * as React from "react";
import { ContextualFAB, SmartFAB } from "./ui/contextual-fab";
import { QuickCaptureProvider, QuickCaptureData } from "./ui/quick-capture-modal";
import { useToast } from "../hooks/use-toast";

interface FastCaptureSystemProps {
  children: React.ReactNode;
  onSaveTask?: (data: QuickCaptureData) => Promise<void>;
  onSaveResource?: (data: QuickCaptureData) => Promise<void>;
  onSaveAchievement?: (data: QuickCaptureData) => Promise<void>;
  onSaveGoal?: (data: QuickCaptureData) => Promise<void>;
  onSaveRoutine?: (data: QuickCaptureData) => Promise<void>;
  className?: string;
}

/**
 * FastCaptureSystem - Complete fast capture implementation
 * 
 * This component provides:
 * - Contextual floating action button that adapts to current page
 * - Quick capture modal with smart defaults and validation
 * - Immediate visual feedback and success states
 * - Mobile-optimized forms with proper keyboard handling
 * - Auto-detection of resource types from URLs
 * - Smart defaults based on context and user patterns
 */
export function FastCaptureSystem({
  children,
  onSaveTask,
  onSaveResource,
  onSaveAchievement,
  onSaveGoal,
  onSaveRoutine,
  className,
}: FastCaptureSystemProps) {
  const { toast } = useToast();

  // Unified save handler that routes to appropriate save function
  const handleSave = React.useCallback(async (data: QuickCaptureData) => {
    try {
      switch (data.type) {
        case 'task':
          if (onSaveTask) {
            await onSaveTask(data);
          } else {
            // Default implementation - you can replace with actual API calls
            console.log('Saving task:', data);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
          }
          break;
          
        case 'resource':
          if (onSaveResource) {
            await onSaveResource(data);
          } else {
            console.log('Saving resource:', data);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          break;
          
        case 'achievement':
          if (onSaveAchievement) {
            await onSaveAchievement(data);
          } else {
            console.log('Saving achievement:', data);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          break;
          
        case 'goal':
          if (onSaveGoal) {
            await onSaveGoal(data);
          } else {
            console.log('Saving goal:', data);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          break;
          
        case 'routine':
          if (onSaveRoutine) {
            await onSaveRoutine(data);
          } else {
            console.log('Saving routine:', data);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          break;
          
        default:
          throw new Error(`Unknown capture type: ${data.type}`);
      }

      // Show success toast
      toast({
        title: "Saved successfully!",
        description: `Your ${data.type} "${data.title}" has been saved.`,
        variant: "default",
      });

    } catch (error) {
      console.error('Failed to save:', error);
      
      // Show error toast
      toast({
        title: "Save failed",
        description: `Failed to save your ${data.type}. Please try again.`,
        variant: "destructive",
      });
      
      // Re-throw to let the modal handle the error state
      throw error;
    }
  }, [onSaveTask, onSaveResource, onSaveAchievement, onSaveGoal, onSaveRoutine, toast]);

  return (
    <QuickCaptureProvider onSave={handleSave}>
      <div className={className}>
        {children}
        
        {/* Smart FAB that hides on scroll and adapts to context */}
        <SmartFAB
          hideOnScroll={true}
          scrollThreshold={100}
          position="bottom-right"
          maxActions={4}
          hapticFeedback={true}
        />
      </div>
    </QuickCaptureProvider>
  );
}

// Hook for programmatically triggering quick capture
export function useFastCapture() {
  const openQuickCapture = React.useCallback((type: QuickCaptureData['type'], initialData?: Partial<QuickCaptureData>) => {
    window.dispatchEvent(new CustomEvent('open-quick-capture', { 
      detail: { type, ...initialData } 
    }));
  }, []);

  return {
    openTask: (data?: Partial<QuickCaptureData>) => openQuickCapture('task', data),
    openResource: (data?: Partial<QuickCaptureData>) => openQuickCapture('resource', data),
    openAchievement: (data?: Partial<QuickCaptureData>) => openQuickCapture('achievement', data),
    openGoal: (data?: Partial<QuickCaptureData>) => openQuickCapture('goal', data),
    openRoutine: (data?: Partial<QuickCaptureData>) => openQuickCapture('routine', data),
  };
}

// Example usage component
export function FastCaptureExample() {
  const fastCapture = useFastCapture();

  const handleSaveTask = async (data: QuickCaptureData) => {
    // Example: Save to your backend API
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save task');
    }
    
    return response.json();
  };

  const handleSaveResource = async (data: QuickCaptureData) => {
    // Example: Save to your backend API
    const response = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save resource');
    }
    
    return response.json();
  };

  return (
    <FastCaptureSystem
      onSaveTask={handleSaveTask}
      onSaveResource={handleSaveResource}
      // Add other save handlers as needed
    >
      <div className="p-4 space-y-4">
        <h1>Fast Capture System Demo</h1>
        
        <div className="space-y-2">
          <button 
            onClick={() => fastCapture.openTask({ title: 'Review project proposal' })}
            className="block w-full p-2 text-left border rounded hover:bg-gray-50"
          >
            Quick Add Task
          </button>
          
          <button 
            onClick={() => fastCapture.openResource({ 
              title: 'Interesting Article',
              url: 'https://example.com/article'
            })}
            className="block w-full p-2 text-left border rounded hover:bg-gray-50"
          >
            Save Resource
          </button>
          
          <button 
            onClick={() => fastCapture.openAchievement({ 
              title: 'Completed morning workout',
              points: 25
            })}
            className="block w-full p-2 text-left border rounded hover:bg-gray-50"
          >
            Log Achievement
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          The floating action button in the bottom-right adapts to the current page context.
          Try navigating to different pages to see different quick actions.
        </p>
      </div>
    </FastCaptureSystem>
  );
}

export default FastCaptureSystem;