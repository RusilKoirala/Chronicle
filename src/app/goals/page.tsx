'use client';

import { GoalList } from '@/components/goals/goal-list';

export default function GoalsPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Goals</h1>
        <p className="text-muted-foreground">
          Set and track your progress towards achieving your goals
        </p>
      </div>
      
      <GoalList />
    </div>
  );
}