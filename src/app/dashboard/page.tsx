'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { FocusDashboard } from '@/components/dashboard/focus-dashboard';

function DashboardContent() {
  return <FocusDashboard />;
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}