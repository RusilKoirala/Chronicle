'use client';

import { useState } from 'react';
import { useResources } from '@/hooks/use-resources';
import { ResourceList } from '@/components/resources/resource-list';
import { ResourceForm } from '@/components/resources/resource-form';
import { Button } from '@/components/ui/button';
import { MobileResponsiveContainer, PageHeader } from '@/components/layout/mobile-responsive';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Plus, BookOpen } from 'lucide-react';

function ResourcesContent() {
  const { resources, isLoading } = useResources();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <MobileResponsiveContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </MobileResponsiveContainer>
    );
  }

  return (
    <MobileResponsiveContainer>
      <PageHeader
        title="Resources"
        description="Save important notes, links, and information"
        icon={<BookOpen className="h-6 w-6 md:h-8 md:w-8" />}
        action={
          <Button onClick={() => setShowForm(true)} className="touch-target">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        }
      />

      <ResourceList />

      <ResourceForm 
        open={showForm} 
        onOpenChange={setShowForm}
      />
    </MobileResponsiveContainer>
  );
}

export default function ResourcesPage() {
  return (
    <AuthGuard>
      <ResourcesContent />
    </AuthGuard>
  );
}