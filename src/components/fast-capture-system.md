# Fast Capture System

The Fast Capture System provides a complete solution for quickly adding content to Chronicle with minimal friction. It consists of contextual floating action buttons and smart capture modals.

## Features

### ✨ Contextual Floating Action Button
- **Context-aware**: Shows different actions based on current page
- **Smart positioning**: Adapts to mobile safe areas and navigation
- **Smooth animations**: Proper transitions and haptic feedback
- **Hide on scroll**: Automatically hides when scrolling down

### 🚀 Quick Capture Modal
- **Fast forms**: Minimal required fields with smart defaults
- **Auto-detection**: Automatically detects resource types from URLs
- **Mobile-optimized**: Proper keyboard handling and touch targets
- **Immediate feedback**: Visual confirmation and success states
- **Validation**: Real-time form validation with helpful error messages

### 📱 Mobile-First Design
- **Touch targets**: 44px minimum touch targets for all interactive elements
- **Keyboard handling**: Prevents zoom on iOS, proper input types
- **Safe areas**: Respects mobile device safe areas
- **Responsive**: Works seamlessly across all screen sizes

## Usage

### Basic Setup

```tsx
import { FastCaptureSystem } from '@/components/fast-capture-system';

function App() {
  const handleSaveTask = async (data) => {
    // Save task to your backend
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  return (
    <FastCaptureSystem
      onSaveTask={handleSaveTask}
      onSaveResource={handleSaveResource}
      onSaveAchievement={handleSaveAchievement}
      onSaveGoal={handleSaveGoal}
      onSaveRoutine={handleSaveRoutine}
    >
      <YourAppContent />
    </FastCaptureSystem>
  );
}
```

### Programmatic Usage

```tsx
import { useFastCapture } from '@/components/fast-capture-system';

function MyComponent() {
  const fastCapture = useFastCapture();

  const handleQuickTask = () => {
    fastCapture.openTask({
      title: 'Review project proposal',
      priority: 'high',
      dueDate: '2024-02-10'
    });
  };

  const handleSaveResource = () => {
    fastCapture.openResource({
      title: 'Interesting Article',
      url: 'https://example.com/article'
    });
  };

  return (
    <div>
      <button onClick={handleQuickTask}>Add Task</button>
      <button onClick={handleSaveResource}>Save Resource</button>
    </div>
  );
}
```

### Custom Actions

```tsx
import { ContextualFAB } from '@/components/ui/contextual-fab';

function CustomPage() {
  const customActions = [
    {
      icon: <CustomIcon />,
      label: "Custom Action",
      onClick: () => console.log('Custom action'),
      variant: "primary",
      priority: 1,
    }
  ];

  return (
    <div>
      <PageContent />
      <ContextualFAB customActions={customActions} />
    </div>
  );
}
```

## Context-Aware Actions

The system automatically shows relevant actions based on the current page:

- **Dashboard**: Quick Task, Log Achievement, Save Resource
- **Tasks**: New Task, Set Goal
- **Goals**: New Goal, Add Task
- **Resources**: Save Resource, Quick Note
- **Achievements**: Log Achievement, Add Task
- **Routines**: New Routine, Quick Task

## Data Types

### QuickCaptureData
```typescript
interface QuickCaptureData {
  type: 'task' | 'resource' | 'achievement' | 'goal' | 'routine';
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
```

## Smart Defaults

The system provides intelligent defaults based on context:

- **Tasks**: Default due date (tomorrow), medium priority
- **Resources**: Auto-detect category from URL (Video, Article, Code, etc.)
- **Achievements**: Default points (10), personal category
- **Goals**: Medium priority, no default due date
- **Routines**: Daily category

## Validation

Built-in validation includes:
- Required title field
- Valid URL format for resources
- Positive points for achievements
- Helpful error messages with suggestions

## Performance

- **Optimistic UI**: Immediate visual feedback before server confirmation
- **Lazy loading**: Modal content loaded only when needed
- **Efficient rendering**: Minimal re-renders with proper memoization
- **Small bundle**: Tree-shakeable components

## Accessibility

- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Proper ARIA labels and descriptions
- **Focus management**: Logical focus flow
- **High contrast**: Works with system themes

## Requirements Validation

This implementation satisfies the following requirements:

- **3.2**: Fast capture forms with minimal required fields ✅
- **3.3**: Contextual floating action button accessible from any page ✅
- **3.4**: Immediate visual feedback for save actions ✅
- **3.5**: Mobile keyboard handling without layout breaks ✅

The system provides a complete fast capture experience that allows users to save information in under 10 seconds while maintaining excellent mobile usability.