'use client';

import React, { useEffect } from 'react';
import { generateThemeCSS, ThemeConfig } from '@/lib/theme';

export const THEME_CHANGE_EVENT = 'likem:theme-change';

export function broadcastThemeChange(config: ThemeConfig) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: config }));
  }
}

interface ThemeProviderProps {
  initialConfig: ThemeConfig;
  children?: React.ReactNode;
}

export default function ThemeProvider({ initialConfig, children }: ThemeProviderProps) {
  useEffect(() => {
    const applyCSS = (config: ThemeConfig) => {
      let styleTag = document.getElementById('likem-dynamic-theme-css') as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'likem-dynamic-theme-css';
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = generateThemeCSS(config);
    };

    const handleThemeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeConfig>;
      if (customEvent.detail) {
        applyCSS(customEvent.detail);
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeEvent);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeEvent);
    };
  }, []);

  return <>{children}</>;
}
