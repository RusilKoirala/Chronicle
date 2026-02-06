'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { 
  Trophy, BookOpen, Target, CheckSquare, Repeat, 
  ArrowRight, ArrowLeft, Check, Zap, Bell, Star,
  Sparkles, TrendingUp, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features?: string[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Chronicle',
    description: 'Your personal tracking companion for achievements, resources, goals, tasks, and routines.',
    icon: <Logo size="xl" variant="icon" />,
  },
  {
    id: 'features',
    title: 'Five Core Features',
    description: 'Everything you need to track your progress and stay organized.',
    icon: <Sparkles className="w-12 h-12" />,
    features: [
      'Track achievements and milestones',
      'Save resources and important links',
      'Set and monitor goals',
      'Manage daily tasks',
      'Build lasting routines'
    ]
  },
  {
    id: 'dashboard',
    title: 'Your Focus Dashboard',
    description: 'See what matters most - today\'s tasks, overdue items, and goal progress at a glance.',
    icon: <TrendingUp className="w-12 h-12" />,
  },
  {
    id: 'quick-capture',
    title: 'Fast Capture System',
    description: 'Quickly save information with the floating action button - available from any page.',
    icon: <Zap className="w-12 h-12" />,
  },
  {
    id: 'reminders',
    title: 'Smart Reminders',
    description: 'Get intelligent notifications for goals and routines to stay on track.',
    icon: <Bell className="w-12 h-12" />,
  },
  {
    id: 'gamification',
    title: 'Earn Points & Achievements',
    description: 'Stay motivated with points, streaks, and meaningful progress tracking.',
    icon: <Star className="w-12 h-12" />,
  }
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = ONBOARDING_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2">
        <CardContent className="p-8 md:p-12">
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentStep 
                    ? "w-8 bg-primary" 
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                )}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={cn(
              "flex items-center justify-center",
              step.id === 'welcome' ? '' : 'w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5'
            )}>
              {step.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {step.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              {step.description}
            </p>

            {/* Features List */}
            {step.features && (
              <div className="space-y-3 max-w-md mx-auto text-left">
                {step.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip
            </Button>

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
