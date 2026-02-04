'use client';

import { useState } from 'react';
import { AchievementList } from '@/components/achievements/achievement-list';
import { AchievementForm } from '@/components/achievements/achievement-form';
import { AchievementFilter } from '@/components/achievements/achievement-filter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAchievements } from '@/hooks/use-achievements';
import { Achievement } from '@/types';
import { Plus } from 'lucide-react';

export default function AchievementsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<Achievement['type'] | 'all'>('all');
  
  const { achievements, addAchievement, updateAchievement, deleteAchievement, isLoading } = useAchievements();

  // Filter achievements based on search and type filter
  const filteredAchievements = achievements
    .filter(achievement => filterType === 'all' || achievement.type === filterType)
    .filter(achievement => {
      if (!searchTerm) return true;
      const lowercaseQuery = searchTerm.toLowerCase();
      return (
        achievement.title.toLowerCase().includes(lowercaseQuery) ||
        achievement.description?.toLowerCase().includes(lowercaseQuery) ||
        achievement.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    });

  const handleSubmit = (data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAchievement) {
      updateAchievement(editingAchievement.id, data);
    } else {
      addAchievement(data);
    }
    setIsDialogOpen(false);
    setEditingAchievement(null);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      deleteAchievement(id);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAchievement(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground mt-1">
            Track your accomplishments and milestones
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
              </DialogTitle>
            </DialogHeader>
            <AchievementForm 
              onSubmit={handleSubmit}
              initialData={editingAchievement}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AchievementFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        totalCount={achievements.length}
        filteredCount={filteredAchievements.length}
      />

      <AchievementList 
        achievements={filteredAchievements}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}