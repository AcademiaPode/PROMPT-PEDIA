// src/components/app-header.tsx
"use client";

import Link from 'next/link';
import { Bot } from 'lucide-react';
// Button and useToast are no longer needed if the download button is removed.
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { Download } from 'lucide-react';

export function AppHeader() {
  // const { toast } = useToast(); // No longer needed

  // const handleDownloadClick = () => { // No longer needed
  //   toast({
  //     title: "Función en Desarrollo",
  //     description: "La descarga de la aplicación estará disponible próximamente.",
  //   });
  // };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Prompt Ped-IA</span>
        </Link>
        {/* El botón de descarga ha sido eliminado según la solicitud */}
        {/*
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadClick}
          className="btn-subtle-hover"
          aria-label="Descargar Prompt Ped-IA"
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
        */}
      </div>
    </header>
  );
}
