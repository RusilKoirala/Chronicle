'use client';

import { Button } from '@/components/ui/button';
import { Monitor, Github } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import Link from 'next/link';
import Image from 'next/image';

interface DownloadButtonsProps {
  variant?: 'hero' | 'cta';
  className?: string;
}

export function DownloadButtons({ variant = 'hero', className = '' }: DownloadButtonsProps) {
  const { isIOS, isAndroid } = useDeviceDetection();

  const buttonSize = variant === 'hero' ? 'lg' : 'default';
  const buttonClass = variant === 'hero' ? 'px-8 py-4 text-lg' : 'px-6 py-3';

  // Single main button based on device
  const getMainButton = () => {
    if (isIOS) {
      return (
        <Button 
          size={buttonSize} 
          className={`bg-white hover:bg-gray-100 text-black border border-gray-200 ${buttonClass}`}
          asChild
        >
          <a href="/downloads/chronicle-ios.ipa" download className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/apple.svg" alt="Apple" width={32} height={32} className="w-8 h-8" />
            </div>
            Download
          </a>
        </Button>
      );
    }

    if (isAndroid) {
      return (
        <Button 
          size={buttonSize} 
          className={`bg-white hover:bg-gray-100 text-black border border-gray-200 ${buttonClass}`}
          asChild
        >
          <a href="/downloads/chronicle-android.apk" download className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/android.svg" alt="Android" width={32} height={32} className="w-8 h-8" />
            </div>
            Download
          </a>
        </Button>
      );
    }

    // Desktop/laptop users see "Open" button
    return (
      <Button 
        size={buttonSize} 
        className={`bg-primary hover:bg-primary/90 text-primary-foreground ${buttonClass}`}
        asChild
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <Monitor className="h-6 w-6" />
          Open
        </Link>
      </Button>
    );
  };

  // GitHub button (always shown on the right)
  const getGitHubButton = () => (
    <Button 
      size={buttonSize} 
      className={`bg-black hover:bg-gray-800 text-white ${buttonClass}`}
      asChild
    >
      <a 
        href="https://github.com/rusilkoirala/chronicle" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3"
      >
        <Github className="h-5 w-5" />
        GitHub
      </a>
    </Button>
  );

  return (
    <div className={`flex flex-row gap-4 justify-center items-center ${className}`}>
      {getMainButton()}
      {getGitHubButton()}
    </div>
  );
}