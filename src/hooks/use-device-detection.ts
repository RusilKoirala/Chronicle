'use client';

import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  isMobileApp: boolean;
  isCapacitor: boolean;
  userAgent: string;
  platform: string;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    isMobileApp: false,
    isCapacitor: false,
    userAgent: '',
    platform: 'web',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      const isCapacitor = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      
      // Capacitor platform detection
      const isIOS = platform === 'ios' || /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = platform === 'android' || /Android/.test(userAgent);
      
      // Mobile detection - either native app or mobile browser
      const isMobile = isCapacitor || isIOS || isAndroid || /Mobile/.test(userAgent);
      const isMobileApp = isCapacitor && (isIOS || isAndroid);
      const isWeb = !isCapacitor;

      setDeviceInfo({
        isMobile,
        isIOS,
        isAndroid,
        isWeb,
        isMobileApp,
        isCapacitor,
        userAgent,
        platform,
      });
    }
  }, []);

  return deviceInfo;
}