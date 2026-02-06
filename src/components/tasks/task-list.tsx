'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { TaskItem } from './task-item';
import { TaskForm } from './task-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { useHybridTasks } from '@/hooks/use-hybrid-tasks';
import { useActionChaining } from '@/hooks/use-action-chaining';
import { NextStepSuggestionsCompact } from '@/components/ui/next-step-suggestions';
import { useDeviceDetection } from '@/hooks/use-device-detection';

export function TaskList() {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleComplete,
    getActiveTasks,
    getCompletedTasks
  } = useHybridTasks();
  
  const { suggestions, trackAction, clearSuggestions, executeSuggestion } = useActionChaining();
  const { isMobile } = useDeviceDetection();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredTasks = () => {
    let filteredTasks = tasks;
    
    // Filter by tab
    if (activeTab === 'active') {
      filteredTasks = getActiveTasks();
    } else if (activeTab === 'completed') {
      filteredTasks = getCompletedTasks();
    }
    
    // Filter by search
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort: incomplete first, then by creation date (newest first)
    return filteredTasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredTasks = getFilteredTasks();

  const handleSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleReschedule = (id: string, newDate: string) => {
    updateTask(id, { dueDate: newDate });
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    toggleComplete(id);
    
    // Track action for next-step suggestions
    if (task && !task.completed) {
      trackAction('task', task);
    }
  };
  
  const handleUpdateTitle = (id: string, title: string) => {
    updateTask(id, { title });
  };
  
  const handleUpdateDescription = (id: string, description: string) => {
    updateTask(id, { description });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const taskCounts = {
    all: tasks.length,
    active: getActiveTasks().length,
    completed: getCompletedTasks().length
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Tabs - Mobile optimized */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="all" className="text-xs md:text-sm px-2 py-2">
            All ({taskCounts.all})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs md:text-sm px-2 py-2">
            Active ({taskCounts.active})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs md:text-sm px-2 py-2">
            Done ({taskCounts.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 md:mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-xl md:text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No tasks found' : 'No tasks yet'}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start by adding your first task to stay organized'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                  onReschedule={handleReschedule}
                  onUpdateTitle={handleUpdateTitle}
                  onUpdateDescription={handleUpdateDescription}
                  enableInlineEdit={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Mobile-optimized Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Next-step suggestions after completing a task */}
      {isMobile && suggestions.length > 0 && (
        <NextStepSuggestionsCompact
          suggestions={suggestions}
          onExecute={executeSuggestion}
          onDismiss={clearSuggestions}
        />
      )}
    </div>
  );
}