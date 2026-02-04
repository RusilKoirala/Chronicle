'use client';

import { Resource } from '@/types';
import { useResources } from '@/hooks/use-resources';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, ExternalLink, FileText, Link, File } from 'lucide-react';
import { useState } from 'react';
import { ResourceForm } from './resource-form';

interface ResourceCardProps {
  resource: Resource;
}

const typeIcons = {
  note: FileText,
  link: Link,
  file: File,
  other: FileText,
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const { deleteResource } = useResources();
  const [showEditForm, setShowEditForm] = useState(false);
  
  const TypeIcon = typeIcons[resource.type];

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this resource?')) {
      deleteResource(resource.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs">
                {resource.type}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditForm(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-lg">{resource.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {resource.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {resource.content}
            </p>
          )}
          
          {resource.url && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs"
              >
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open Link
                </a>
              </Button>
            </div>
          )}

          {resource.category && (
            <div>
              <Badge variant="outline" className="text-xs">
                {resource.category}
              </Badge>
            </div>
          )}

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2 border-t">
            Created {formatDate(resource.createdAt)}
          </div>
        </CardContent>
      </Card>

      <ResourceForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        resource={resource}
      />
    </>
  );
}