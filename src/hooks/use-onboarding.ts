'use client';

import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'chronicle_onboarding_completed';
const FEATURE_DISCOVERY_KEY = 'chronicle_feature_discovery';

export interface FeatureDiscovery {
  quickCapture: boolean;
  dashboard: boolean;
  reminders: boolean;
  gamification: boolean;
  contextualActions: boolean;
}

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [featureDiscovery, setFeatureDiscovery] = useState<FeatureDiscovery>({
    quickCapture: false,
    dashboard: false,
    reminders: false,
    gamification: false,
    contextualActions: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if onboarding is completed
    const completed = localStorage.getItem(ONBOARDING_KEY) === 'true';
    setHasCompletedOnboarding(completed);

    // Load feature discovery state
    const discoveryData = localStorage.getItem(FEATURE_DISCOVERY_KEY);
    if (discoveryData) {
      try {
        setFeatureDiscovery(JSON.parse(discoveryData));
      } catch (error) {
        console.error('Error parsing feature discovery data:', error);
      }
    }
  }, []);

  const completeOnboarding = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(FEATURE_DISCOVERY_KEY);
    setHasCompletedOnboarding(false);
    setFeatureDiscovery({
      quickCapture: false,
      dashboard: false,
      reminders: false,
      gamification: false,
      contextualActions: false,
    });
  };

  const markFeatureDiscovered = (feature: keyof FeatureDiscovery) => {
    if (typeof window === 'undefined') return;
    
    const newDiscovery = {
      ...featureDiscovery,
      [feature]: true,
    };
    
    setFeatureDiscovery(newDiscovery);
    localStorage.setItem(FEATURE_DISCOVERY_KEY, JSON.stringify(newDiscovery));
  };

  const hasDiscoveredFeature = (feature: keyof FeatureDiscovery): boolean => {
    return featureDiscovery[feature];
  };

  return {
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
    featureDiscovery,
    markFeatureDiscovered,
    hasDiscoveredFeature,
  };
}
