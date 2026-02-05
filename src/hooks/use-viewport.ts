'use client';

import { useState, useEffect } from 'react';

interface ViewportSize {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
}

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function useViewport() {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  });

  const [safeArea, setSafeArea] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });

      // Get safe area insets from CSS environment variables
      const computedStyle = getComputedStyle(document.documentElement);
      const getSafeAreaValue = (property: string): number => {
        const value = computedStyle.getPropertyValue(property);
        return value ? parseInt(value.replace('px', ''), 10) || 0 : 0;
      };

      setSafeArea({
        top: getSafeAreaValue('--safe-area-inset-top') || 
             ((window.screen as any)?.availTop ? (window.screen as any).availTop : 0),
        bottom: getSafeAreaValue('--safe-area-inset-bottom') || 0,
        left: getSafeAreaValue('--safe-area-inset-left') || 0,
        right: getSafeAreaValue('--safe-area-inset-right') || 0,
      });
    };

    updateViewport();

    // Listen for viewport changes
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    
    // Listen for visual viewport changes (keyboard, etc.)
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', updateViewport);
    }

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', updateViewport);
      }
    };
  }, []);

  return {
    viewport,
    safeArea,
    isLandscape: viewport.width > viewport.height,
    isPortrait: viewport.height > viewport.width,
    aspectRatio: viewport.width / viewport.height,
  };
}

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (!('visualViewport' in window)) return;

    const visualViewport = window.visualViewport!;
    const initialHeight = visualViewport.height;

    const handleViewportChange = () => {
      const currentHeight = visualViewport.height;
      const heightDifference = initialHeight - currentHeight;
      
      // Consider keyboard open if height difference is significant (> 150px)
      const keyboardOpen = heightDifference > 150;
      
      setKeyboardHeight(keyboardOpen ? heightDifference : 0);
      setIsKeyboardOpen(keyboardOpen);
    };

    visualViewport.addEventListener('resize', handleViewportChange);

    return () => {
      visualViewport.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardOpen,
  };
}

export function useScreenOrientation() {
  const [orientation, setOrientation] = useState<{
    angle: number;
    type: string;
  }>({
    angle: 0,
    type: 'portrait-primary',
  });

  useEffect(() => {
    const updateOrientation = () => {
      if ('screen' in window && 'orientation' in window.screen) {
        setOrientation({
          angle: window.screen.orientation.angle,
          type: window.screen.orientation.type,
        });
      } else {
        // Fallback for older browsers
        const angle = window.orientation || 0;
        setOrientation({
          angle: typeof angle === 'number' ? angle : 0,
          type: Math.abs(angle) === 90 ? 'landscape-primary' : 'portrait-primary',
        });
      }
    };

    updateOrientation();

    window.addEventListener('orientationchange', updateOrientation);
    if ('screen' in window && 'orientation' in window.screen) {
      window.screen.orientation.addEventListener('change', updateOrientation);
    }

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      if ('screen' in window && 'orientation' in window.screen) {
        window.screen.orientation.removeEventListener('change', updateOrientation);
      }
    };
  }, []);

  return {
    orientation,
    isLandscape: orientation.type.includes('landscape'),
    isPortrait: orientation.type.includes('portrait'),
    angle: orientation.angle,
  };
}

// Hook for handling viewport units that work correctly on mobile
export function useViewportUnits() {
  const [units, setUnits] = useState({
    vh: 0,
    vw: 0,
    dvh: 0, // Dynamic viewport height
    dvw: 0, // Dynamic viewport width
  });

  useEffect(() => {
    const updateUnits = () => {
      const vh = window.innerHeight * 0.01;
      const vw = window.innerWidth * 0.01;
      
      // Dynamic viewport units (better for mobile)
      const dvh = document.documentElement.clientHeight * 0.01;
      const dvw = document.documentElement.clientWidth * 0.01;

      setUnits({ vh, vw, dvh, dvw });

      // Set CSS custom properties for use in stylesheets
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--vw', `${vw}px`);
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);
      document.documentElement.style.setProperty('--dvw', `${dvw}px`);
    };

    updateUnits();

    window.addEventListener('resize', updateUnits);
    window.addEventListener('orientationchange', updateUnits);

    return () => {
      window.removeEventListener('resize', updateUnits);
      window.removeEventListener('orientationchange', updateUnits);
    };
  }, []);

  return units;
}