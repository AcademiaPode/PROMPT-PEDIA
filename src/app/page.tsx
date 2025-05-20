
// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/tasks';
import { TaskListSection } from '@/components/task-list-section';
import { PromptFormSection } from '@/components/prompt-form-section';
import { PromptDisplaySection } from '@/components/prompt-display-section';
import { QuickPromptSection } from '@/components/quick-prompt-section';
import { Loader2 as IconLoader } from 'lucide-react';

type ViewState = 'taskList' | 'form' | 'promptResult';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewState>('taskList');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
            <IconLoader className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Cargando Prompt Ped-IA...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-10 space-y-10 md:space-y-12">
      
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
