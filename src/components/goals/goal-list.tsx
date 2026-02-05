'use client';

import { useState } from 'react';
import { Goal } from '@/types';
import { GoalCard } from './goal-card';
import { GoalForm } from './goal-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { useHybridGoals } from '@/hooks/use-hybrid-goals';

export function GoalList() {
  const { goals, addGoal, updateGoal, deleteGoal, updateProgress } = useHybridGoals();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && goal.status === activeTab;
  });

  const handleSubmit = (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data);
    } else {
      addGoal(data);
    }
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  const goalCounts = {
    all: goals.length,
    'not-started': goals.filter(g => g.status === 'not-started').length,
    'in-progress': goals.filter(g => g.status === 'in-progress').length,
    'completed': goals.filter(g => g.status === 'completed').length
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Tabs - Mobile optimized */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-xs md:text-sm px-2 py-2">
            All ({goalCounts.all})
          </TabsTrigger>
          <TabsTrigger value="not-started" className="text-xs md:text-sm px-2 py-2">
            <span className="hidden sm:inline">Not Started</span>
            <span className="sm:hidden">New</span>
            <span className="ml-1">({goalCounts['not-started']})</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="text-xs md:text-sm px-2 py-2">
            <span className="hidden sm:inline">In Progress</span>
            <span className="sm:hidden">Active</span>
            <span className="ml-1">({goalCounts['in-progress']})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs md:text-sm px-2 py-2">
            Done ({goalCounts.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 md:mt-6">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-xl md:text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No goals found' : 'No goals yet'}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start by adding your first goal to track your progress'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Goal
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateProgress={updateProgress}
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
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </DialogTitle>
          </DialogHeader>
          <GoalForm
            goal={editingGoal || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}