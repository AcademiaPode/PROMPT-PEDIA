// src/components/prompt-display-section.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PromptDisplaySectionProps {
  prompt: string;
  onBackToTasks: () => void;
}

export function PromptDisplaySection({ prompt, onBackToTasks }: PromptDisplaySectionProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "¡Copiado!",
        description: "El prompt ha sido copiado al portapapeles.",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "No se pudo copiar el prompt.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card id="promptResultSection" className="w-full max-w-2xl mx-auto shadow-xl border-accent/30 card-subtle-hover">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
            <Sparkles className="mr-3 h-8 w-8" />
            Tu Prompt Optimizado está Listo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          id="generatedPrompt"
          value={prompt}
          readOnly
          rows={10}
          className="w-full p-3 border rounded-lg bg-input/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none text-base"
        />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 pt-6 border-t border-border/50">
          <Button 
            type="button" 
            id="backToTasksFromPromptButton" 
            onClick={onBackToTasks} 
            variant="secondary"
            className="w-full sm:w-auto btn-subtle-hover"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Tareas
          </Button>
          <Button 
            type="button" 
            id="copyButton" 
            onClick={handleCopy}
            className="w-full sm:w-auto btn-subtle-hover text-lg py-3 px-6"
          >
            <Copy className="mr-2 h-5 w-5" /> Copiar Prompt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
