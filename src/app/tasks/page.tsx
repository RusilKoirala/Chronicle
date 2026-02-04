'use client';

import { TaskList } from '@/components/tasks/task-list';

export default function TasksPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your daily tasks and stay organized
        </p>
      </div>
      
      <TaskList />
    </div>
  );
}