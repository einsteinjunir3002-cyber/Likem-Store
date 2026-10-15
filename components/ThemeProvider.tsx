'use client';

import React, { useEffect, useState } from 'react';
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
  const [css, setCss] = useState<string>(() => generateThemeCSS(initialConfig));

  useEffect(() => {
    // Set initially
    setCss(generateThemeCSS(initialConfig));

    const handleThemeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeConfig>;
      if (customEvent.detail) {
        setCss(generateThemeCSS(customEvent.detail));
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeEvent);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeEvent);
    };
  }, [initialConfig]);

  return (
    <>
      <style
        id="likem-dynamic-theme-css"
        dangerouslySetInnerHTML={{ __html: css }}
      />
      {children}
    </>
  );
}
