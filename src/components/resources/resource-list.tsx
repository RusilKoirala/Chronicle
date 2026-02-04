'use client';

import { useState } from 'react';
import { useResources } from '@/hooks/use-resources';
import { ResourceCard } from './resource-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Resource } from '@/types';

export function ResourceList() {
  const { 
    resources, 
    searchResources, 
    getResourcesByType, 
    getResourcesByCategory,
    getAllCategories 
  } = useResources();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<Resource['type'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = getAllCategories();

  // Apply filters
  let filteredResources = resources;

  if (searchQuery) {
    filteredResources = searchResources(searchQuery);
  }

  if (typeFilter !== 'all') {
    filteredResources = filteredResources.filter(resource => resource.type === typeFilter);
  }

  if (categoryFilter !== 'all') {
    filteredResources = filteredResources.filter(resource => resource.category === categoryFilter);
  }

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
  };

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || categoryFilter !== 'all';

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Filter className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
        <p className="text-muted-foreground mb-4">
          Start building your resource library by adding your first note, link, or file.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={(value: Resource['type'] | 'all') => setTypeFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="link">Link</SelectItem>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {categories.length > 0 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No resources match your current filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}