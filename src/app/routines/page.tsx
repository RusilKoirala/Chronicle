'use client';

import { RoutineList } from '@/components/routines/routine-list';

export default function RoutinesPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Routines</h1>
        <p className="text-muted-foreground">
          Build consistent habits with daily and weekly routines
        </p>
      </div>
      
      <RoutineList />
    </div>
  );
}