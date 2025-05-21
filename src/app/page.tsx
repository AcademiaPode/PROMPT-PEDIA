
// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/tasks';
import { TaskListSection } from '@/components/task-list-section';
import { PromptFormSection } from '@/components/prompt-form-section';
import { PromptDisplaySection } from '@/components/prompt-display-section';
import { QuickPromptSection } from '@/components/quick-prompt-section';
import { Loader2 as IconLoader, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type ViewState = 'taskList' | 'form' | 'promptResult';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewState>('taskList');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);

  const [isClient, setIsClient] = useState(false);
  
  // PWA Install Button Logic
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
      console.log("'beforeinstallprompt' event fired and stashed.");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
      toast({
        title: "¡Aplicación Instalada!",
        description: "PP-IA ha sido instalada en tu dispositivo.",
      });
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    setShowInstallButton(false); // Hide button immediately after click
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    if (outcome === 'accepted') {
        // Toast is handled by appinstalled event listener
    } else {
      toast({
        title: "Instalación Cancelada",
        description: "Puedes instalar PP-IA más tarde desde el menú de tu navegador.",
        variant: "default",
      });
    }
    setDeferredPrompt(null);
  };
  // End PWA Install Button Logic


  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setGeneratedPrompt(''); 
    setCurrentView('form');
  };

  const handleBackToTasks = () => {
    setSelectedTask(null);
    setGeneratedPrompt('');
    setCurrentView('taskList');
  };

  const handlePromptGenerated = (prompt: string) => {
    setGeneratedPrompt(prompt);
    setCurrentView('promptResult');
  };

  if (!isClient) {
    return (
        <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]"> {/* Adjust min-height if needed */}
            <IconLoader className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Cargando Prompt Ped-IA...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-10 space-y-10 md:space-y-12">
      
      {showInstallButton && (
        <div className="w-full flex justify-end mb-4 -mt-4 md:-mt-6 animate-fadeIn">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstallClick}
            className="btn-subtle-hover shadow-md border-primary/50 hover:border-primary"
            aria-label="Instalar esta app PP-IA"
            title="Instalar PP-IA en tu dispositivo"
          >
            <Download className="mr-2 h-4 w-4" />
            Instalar esta app
          </Button>
        </div>
      )}

      <section id="hero" className="text-center py-8 md:py-10 animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="block">Bienvenido a</span>
          <span className="block text-primary">Prompt Ped-IA</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-6">
          Desata el poder de la inteligencia artificial. Genera prompts de alta calidad para cualquier tarea, optimizados para obtener los mejores resultados.
        </p>
      </section>

      <section id="quickPrompt" className="max-w-3xl mx-auto animate-slideInUp" style={{ animationDelay: '0.2s' }}>
        <QuickPromptSection />
      </section>

      <section id="detailedTaskFlow" className="animate-slideInUp" style={{ animationDelay: '0.4s' }}>
        {currentView === 'taskList' && (
          <>
            <header className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">O explora nuestras plantillas de tareas:</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">Selecciona una tarea predefinida y completa los campos para generar un prompt aún más específico y detallado.</p>
            </header>
            <TaskListSection onTaskSelect={handleTaskSelect} />
          </>
        )}
        
        {currentView === 'form' && selectedTask && (
          <PromptFormSection
            task={selectedTask}
            onBack={handleBackToTasks}
            onPromptGenerated={handlePromptGenerated}
            setIsLoading={setIsLoadingForm}
            isLoading={isLoadingForm}
          />
        )}
      
        {currentView === 'promptResult' && (
          <PromptDisplaySection
            prompt={generatedPrompt}
            onBackToTasks={handleBackToTasks}
          />
        )}
      </section>
      
    </div>
  );
}
