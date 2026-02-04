import { Achievement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, ExternalLink } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

const typeColors = {
  book: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  certificate: 'bg-green-100 text-green-800 hover:bg-green-200',
  skill: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  other: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
};

export function AchievementCard({ achievement, onEdit, onDelete }: AchievementCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <Badge 
              className={`mb-2 ${typeColors[achievement.type]}`}
              variant="secondary"
            >
              {achievement.type}
            </Badge>
            <CardTitle className="text-lg leading-tight">
              {achievement.title}
            </CardTitle>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(achievement)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(achievement.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {achievement.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {achievement.description}
          </p>
        )}
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Completed: {formatDate(achievement.dateCompleted)}
          </p>
          
          {achievement.proofUrl && (
            <a
              href={achievement.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View Proof
            </a>
          )}
        </div>

        {achievement.tags.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {achievement.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}