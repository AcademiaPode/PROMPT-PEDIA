// src/components/app-header.tsx
"use client";

import Link from 'next/link';
import { Bot } from 'lucide-react';
// Removed Button, Download, useEffect, useState, useToast as they are no longer used here for PWA install button.

// Removed BeforeInstallPromptEvent interface as it's moved to page.tsx

export function AppHeader() {
  // Removed deferredPrompt, showInstallButton, and related useEffects & handleInstallClick for PWA button.
  // The PWA install button logic is now in src/app/page.tsx

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Prompt Ped-IA</span>
        </Link>
        
        {/* PWA Install Button has been moved to src/app/page.tsx */}
      </div>
    </header>
  );
}
