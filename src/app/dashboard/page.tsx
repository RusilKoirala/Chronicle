'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { FocusDashboard } from '@/components/dashboard/focus-dashboard';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { useOnboarding } from '@/hooks/use-onboarding';

function DashboardContent() {
  const { hasCompletedOnboarding, completeOnboarding } = useOnboarding();

  // Show loading state while checking onboarding status
  if (hasCompletedOnboarding === null) {
    return null;
  }

  // Show onboarding for first-time users
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return <FocusDashboard />;
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}