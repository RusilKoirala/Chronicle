'use client';

import { TaskList } from '@/components/tasks/task-list';
import { MobilePageLayout } from '@/components/layout/mobile-page-layout';

export default function TasksPage() {
  return (
    <MobilePageLayout 
      title="Tasks" 
      subtitle="Manage your daily tasks and stay organized"
    >
      <TaskList />
    </MobilePageLayout>
  );
}