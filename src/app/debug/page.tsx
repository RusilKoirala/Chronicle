import { SupabaseStatus } from '@/components/debug/supabase-status';

export default function DebugPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      <SupabaseStatus />
    </div>
  );
}