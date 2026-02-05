'use client';

import { Button } from '@/components/ui/button';
import { Apple, Smartphone, Monitor, Github, Download } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import Link from 'next/link';

interface DownloadButtonsProps {
  variant?: 'hero' | 'cta';
  className?: string;
}

export function DownloadButtons({ variant = 'hero', className = '' }: DownloadButtonsProps) {
  const { isIOS, isAndroid, isWeb } = useDeviceDetection();

  const buttonSize = variant === 'hero' ? 'lg' : 'default';
  const buttonClass = variant === 'hero' ? 'px-8 py-4 text-lg' : 'px-6 py-3';

  // Show primary button based on device
  const getPrimaryButton = () => {
    if (isIOS) {
      return (
        <Button 
          size={buttonSize} 
          className={`bg-black hover:bg-gray-800 text-white ${buttonClass}`}
          asChild
        >
          <a href="/downloads/chronicle-ios.ipa" download className="flex items-center gap-3">
            <Apple className="h-6 w-6" />
            Download for iOS
          </a>
        </Button>
      );
    }

    if (isAndroid) {
      return (
        <Button 
          size={buttonSize} 
          className={`bg-green-600 hover:bg-green-700 text-white ${buttonClass}`}
          asChild
        >
          <a href="/downloads/chronicle-android.apk" download className="flex items-center gap-3">
            <Smartphone className="h-6 w-6" />
            Download APK
          </a>
        </Button>
      );
    }

    // Web users see web app button as primary
    return (
      <Button 
        size={buttonSize} 
        className={`bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`}
        asChild
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <Monitor className="h-6 w-6" />
          Open Web App
        </Link>
      </Button>
    );
  };

  // Show secondary options
  const getSecondaryButtons = () => {
    if (isIOS) {
      return (
        <>
          <Button 
            size={buttonSize} 
            variant="outline" 
            className={buttonClass}
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <Monitor className="h-5 w-5" />
              Try Web Version
            </Link>
          </Button>
          <Button 
            size={buttonSize} 
            variant="ghost" 
            className={buttonClass}
            asChild
          >
            <a href="/downloads/chronicle-android.apk" download className="flex items-center gap-3">
              <Download className="h-5 w-5" />
              Android APK
            </a>
          </Button>
        </>
      );
    }

    if (isAndroid) {
      return (
        <>
          <Button 
            size={buttonSize} 
            variant="outline" 
            className={buttonClass}
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <Monitor className="h-5 w-5" />
              Try Web Version
            </Link>
          </Button>
          <Button 
            size={buttonSize} 
            variant="ghost" 
            className={buttonClass}
            asChild
          >
            <a href="/downloads/chronicle-ios.ipa" download className="flex items-center gap-3">
              <Download className="h-5 w-5" />
              iOS App
            </a>
          </Button>
        </>
      );
    }

    // Web users see mobile options as secondary
    return (
      <>
        <Button 
          size={buttonSize} 
          variant="outline" 
          className={buttonClass}
          asChild
        >
          <a href="/downloads/chronicle-ios.ipa" download className="flex items-center gap-3">
            <Apple className="h-5 w-5" />
            iOS App
          </a>
        </Button>
        <Button 
          size={buttonSize} 
          variant="outline" 
          className={buttonClass}
          asChild
        >
          <a href="/downloads/chronicle-android.apk" download className="flex items-center gap-3">
            <Smartphone className="h-5 w-5" />
            Android APK
          </a>
        </Button>
        <Button 
          size={buttonSize} 
          variant="ghost" 
          className={buttonClass}
          asChild
        >
          <a href="https://github.com/yourusername/chronicle" className="flex items-center gap-3">
            <Github className="h-5 w-5" />
            GitHub
          </a>
        </Button>
      </>
    );
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${className}`}>
      {getPrimaryButton()}
      <div className="flex flex-col sm:flex-row gap-2">
        {getSecondaryButtons()}
      </div>
    </div>
  );
}