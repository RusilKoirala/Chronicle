'use client';

import { useState } from 'react';
import { Achievement } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AchievementFormProps {
  onSubmit: (data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Achievement | null;
}

export function AchievementForm({ onSubmit, initialData }: AchievementFormProps) {
  const [formData, setFormData] = useState({
    type: (initialData?.type || 'book') as Achievement['type'],
    title: initialData?.title || '',
    description: initialData?.description || '',
    dateCompleted: initialData?.dateCompleted ? initialData.dateCompleted.split('T')[0] : new Date().toISOString().split('T')[0],
    tags: initialData?.tags || [],
    proofUrl: initialData?.proofUrl || ''
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dateCompleted: new Date(formData.dateCompleted).toISOString(),
      proofUrl: formData.proofUrl.trim() || undefined
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Type *
        </label>
        <Select 
          value={formData.type}
          onValueChange={(value: Achievement['type']) => 
            setFormData(prev => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="skill">Skill</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Title *
        </label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Read 'The Great Gatsby'"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Optional details about this achievement..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Date Completed *
        </label>
        <Input
          type="date"
          required
          value={formData.dateCompleted}
          onChange={(e) => setFormData(prev => ({ ...prev, dateCompleted: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add a tag and press Enter"
            className="flex-1"
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Proof URL
        </label>
        <Input
          type="url"
          value={formData.proofUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, proofUrl: e.target.value }))}
          placeholder="https://example.com/certificate"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? 'Update Achievement' : 'Add Achievement'}
        </Button>
      </div>
    </form>
  );
}