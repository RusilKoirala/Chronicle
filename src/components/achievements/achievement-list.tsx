import { Achievement } from '@/types';
import { AchievementCard } from './achievement-card';

interface AchievementListProps {
  achievements: Achievement[];
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

export function AchievementList({ achievements, onEdit, onDelete }: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🏆</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
        <p className="text-muted-foreground mb-4">
          Start tracking your accomplishments by adding your first achievement.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}