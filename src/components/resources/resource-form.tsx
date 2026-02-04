'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/types';
import { useResources } from '@/hooks/use-resources';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ResourceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource;
}

export function ResourceForm({ open, onOpenChange, resource }: ResourceFormProps) {
  const { addResource, updateResource, getAllCategories } = useResources();
  const [formData, setFormData] = useState({
    type: 'note' as Resource['type'],
    title: '',
    content: '',
    url: '',
    category: '',
    tags: '',
  });

  const existingCategories = getAllCategories();

  useEffect(() => {
    if (resource) {
      setFormData({
        type: resource.type,
        title: resource.title,
        content: resource.content,
        url: resource.url || '',
        category: resource.category,
        tags: resource.tags.join(', '),
      });
    } else {
      setFormData({
        type: 'note',
        title: '',
        content: '',
        url: '',
        category: '',
        tags: '',
      });
    }
  }, [resource, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const resourceData = {
      type: formData.type,
      title: formData.title.trim(),
      content: formData.content.trim(),
      url: formData.url.trim() || undefined,
      category: formData.category.trim(),
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
    };

    if (resource) {
      updateResource(resource.id, resourceData);
    } else {
      addResource(resourceData);
    }

    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Resource['type']) => 
                handleInputChange('type', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter resource title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content/Description</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter content or description"
              rows={4}
            />
          </div>

          {(formData.type === 'link' || formData.url) && (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Enter category"
              list="categories"
            />
            {existingCategories.length > 0 && (
              <datalist id="categories">
                {existingCategories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {resource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}