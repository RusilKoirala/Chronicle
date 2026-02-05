'use client';

import { useState } from 'react';
import { Routine } from '@/types';
import { RoutineCard } from './routine-card';
import { RoutineForm } from './routine-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { useHybridRoutines } from '@/hooks/use-hybrid-routines';

export function RoutineList() {
  const { 
    routines, 
    addRoutine, 
    updateRoutine, 
    deleteRoutine, 
    toggleActive,
    getActiveRoutines,
    getInactiveRoutines
  } = useHybridRoutines();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredRoutines = () => {
    let filteredRoutines = routines;
    
    // Filter by tab
    if (activeTab === 'active') {
      filteredRoutines = getActiveRoutines();
    } else if (activeTab === 'inactive') {
      filteredRoutines = getInactiveRoutines();
    }
    
    // Filter by search
    if (searchQuery) {
      filteredRoutines = filteredRoutines.filter(routine =>
        routine.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort: active first, then by creation date (newest first)
    return filteredRoutines.sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredRoutines = getFilteredRoutines();

  const handleSubmit = (data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, data);
    } else {
      addRoutine(data);
    }
    setIsFormOpen(false);
    setEditingRoutine(null);
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this routine?')) {
      deleteRoutine(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingRoutine(null);
  };

  const routineCounts = {
    all: routines.length,
    active: getActiveRoutines().length,
    inactive: getInactiveRoutines().length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search routines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Routine
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({routineCounts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({routineCounts.active})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({routineCounts.inactive})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredRoutines.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No routines found' : 'No routines yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start by creating your first routine to build consistent habits'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Routine
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={toggleActive}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRoutine ? 'Edit Routine' : 'Add New Routine'}
            </DialogTitle>
          </DialogHeader>
          <RoutineForm
            routine={editingRoutine || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}