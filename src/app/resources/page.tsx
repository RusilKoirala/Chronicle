'use client';

import { useState } from 'react';
import { useResources } from '@/hooks/use-resources';
import { ResourceList } from '@/components/resources/resource-list';
import { ResourceForm } from '@/components/resources/resource-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ResourcesPage() {
  const { resources, isLoading } = useResources();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Save important notes, links, and information
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <ResourceList />

      <ResourceForm 
        open={showForm} 
        onOpenChange={setShowForm}
      />
    </div>
  );
}