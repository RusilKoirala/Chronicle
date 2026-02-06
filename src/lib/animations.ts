/**
 * Animation utilities and configurations for Chronicle
 * Provides consistent animations with reduced motion support
 */

export const animations = {
  // Duration tokens
  duration: {
    instant: 100,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 400,
    slowest: 500,
  },

  // Easing functions
  easing: {
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Scale animations
  scale: {
    press: 0.98,
    hover: 1.02,
    pop: 1.05,
  },

  // Slide animations
  slide: {
    distance: {
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
    },
  },
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on reduced motion preference
 */
export function getAnimationDuration(duration: keyof typeof animations.duration): number {
  return prefersReducedMotion() ? 0 : animations.duration[duration];
}

/**
 * Animation class generator with reduced motion support
 */
export function animationClass(
  animation: string,
  options?: {
    duration?: keyof typeof animations.duration;
    delay?: number;
    respectReducedMotion?: boolean;
  }
): string {
  const { duration = 'normal', delay = 0, respectReducedMotion = true } = options || {};
  
  if (respectReducedMotion && prefersReducedMotion()) {
    return '';
  }

  const durationMs = animations.duration[duration];
  const delayStyle = delay > 0 ? `animation-delay: ${delay}ms;` : '';
  
  return `${animation} duration-${durationMs} ${delayStyle}`;
}

/**
 * Micro-interaction animations
 */
export const microAnimations = {
  // Button press
  buttonPress: {
    transform: `scale(${animations.scale.press})`,
    transition: `transform ${animations.duration.fast}ms ${animations.easing.easeOut}`,
  },

  // Hover lift
  hoverLift: {
    transform: `translateY(-2px) scale(${animations.scale.hover})`,
    transition: `all ${animations.duration.normal}ms ${animations.easing.easeOut}`,
  },

  // Success pulse
  successPulse: {
    animation: 'pulse 500ms ease-out',
  },

  // Shake (for errors)
  shake: {
    animation: 'shake 400ms ease-in-out',
  },

  // Fade in
  fadeIn: {
    animation: `fadeIn ${animations.duration.normal}ms ${animations.easing.easeOut}`,
  },

  // Slide in from bottom
  slideInBottom: {
    animation: `slideInBottom ${animations.duration.slow}ms ${animations.easing.easeOut}`,
  },

  // Slide in from right
  slideInRight: {
    animation: `slideInRight ${animations.duration.slow}ms ${animations.easing.easeOut}`,
  },

  // Scale in
  scaleIn: {
    animation: `scaleIn ${animations.duration.normal}ms ${animations.easing.spring}`,
  },

  // Bounce in
  bounceIn: {
    animation: `bounceIn ${animations.duration.slower}ms ${animations.easing.bounce}`,
  },
} as const;

/**
 * Stagger animation helper
 */
export function getStaggerDelay(index: number, baseDelay: number = 50): number {
  return prefersReducedMotion() ? 0 : index * baseDelay;
}

/**
 * Spring animation configuration
 */
export const springConfig = {
  default: {
    tension: 300,
    friction: 30,
  },
  gentle: {
    tension: 120,
    friction: 14,
  },
  wobbly: {
    tension: 180,
    friction: 12,
  },
  stiff: {
    tension: 400,
    friction: 40,
  },
  slow: {
    tension: 280,
    friction: 60,
  },
} as const;

/**
 * Celebration animation for achievements
 */
export function triggerCelebration() {
  if (prefersReducedMotion()) return;
  
  // Add confetti or celebration effect
  const event = new CustomEvent('chronicle:celebrate', {
    detail: { type: 'achievement' },
  });
  window.dispatchEvent(event);
}

/**
 * Haptic feedback helper
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 15,
      heavy: 20,
    };
    navigator.vibrate(patterns[type]);
  }
}

/**
 * Page transition helper
 */
export const pageTransitions = {
  enter: {
    opacity: 0,
    y: 20,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
} as const;
