'use client';

import { GoalList } from '@/components/goals/goal-list';
import { MobilePageLayout } from '@/components/layout/mobile-page-layout';

export default function GoalsPage() {
  return (
    <MobilePageLayout 
      title="Goals" 
      subtitle="Set and track your progress towards achieving your goals"
    >
      <GoalList />
    </MobilePageLayout>
  );
}