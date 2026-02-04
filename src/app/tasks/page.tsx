'use client';

export default function TasksPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground mb-4">
          Coming soon - Manage your daily tasks and todos
        </p>
      </div>
    </div>
  );
}