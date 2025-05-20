// src/components/quick-prompt-section.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, Copy, RefreshCw } from 'lucide-react';
import { improvePromptQuality, type ImprovePromptQualityInput } from '@/ai/flows/improve-prompt-quality';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const promptSuggestions = [
  "¿Qué haría un robot en un mundo sin humanos?",
  "Genera un personaje histórico alternativo.",
  "Crea un guion para una IA con emociones.",
  "Describe un planeta alienígena con flora y fauna únicas.",
  "Escribe un poema sobre el silencio de la noche.",
  "Formula tres preguntas filosóficas sobre la conciencia.",
];

export function QuickPromptSection() {
  const [userInput, setUserInput] = useState<string>('');
  const [improvedPrompt, setImprovedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [suggestionAnimation, setSuggestionAnimation] = useState<'enter' | 'exit' | null>(null);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setSuggestionAnimation('exit');
      setTimeout(() => {
        setCurrentSuggestionIndex((prevIndex) => (prevIndex + 1) % promptSuggestions.length);
        setSuggestionAnimation('enter');
      }, 500); // Match exit animation duration
    }, 6000); // Change suggestion every 6 seconds (5s display + 0.5s exit + 0.5s enter)

    // Initial animation
    setTimeout(() => setSuggestionAnimation('enter'), 100);


    return () => clearInterval(intervalId);
  }, []);

  const handleImprovePrompt = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Entrada Vacía",
        description: "Por favor, escribe un prompt para mejorar.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setImprovedPrompt(''); 
    try {
      const aiInput: ImprovePromptQualityInput = { prompt: userInput };
      const result = await improvePromptQuality(aiInput);
      setImprovedPrompt(result.improvedPrompt);
      toast({
        title: "¡Prompt Mejorado!",
        description: "Tu prompt ha sido optimizado.",
      });
    } catch (error) {
      console.error("Error improving prompt:", error);
      toast({
        title: "Error",
        description: "No se pudo mejorar el prompt. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (textToCopy: string, type: 'original' | 'mejorado') => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "¡Copiado!",
        description: `El prompt ${type} ha sido copiado al portapapeles.`,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error de Copia",
        description: `No se pudo copiar el prompt ${type}.`,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setUserInput('');
    setImprovedPrompt('');
  }

  return (
    <Card className="w-full shadow-xl border-accent/30 card-subtle-hover">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center">
          <Wand2 className="mr-3 h-8 w-8" />
          Mejora tu Prompt al Instante
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            id="quickPromptInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe aquí tu prompt rápido..."
            rows={4}
            className="w-full p-3 border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring resize-none text-base"
            disabled={isLoading}
          />
           <div className="mt-3 h-6 text-sm text-muted-foreground italic text-center overflow-hidden">
            {suggestionAnimation && (
              <span
                className={cn(
                  "inline-block",
                  suggestionAnimation === 'enter' && "animate-suggestion-enter",
                  suggestionAnimation === 'exit' && "animate-suggestion-exit"
                )}
                onAnimationEnd={() => {
                  if (suggestionAnimation === 'exit') {
                    setSuggestionAnimation(null); // Reset for next cycle if needed
                  }
                }}
              >
                {promptSuggestions[currentSuggestionIndex]}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2">
           <Button 
            type="button" 
            onClick={handleReset} 
            variant="outline" 
            className="w-full sm:w-auto btn-subtle-hover"
            disabled={isLoading || (!userInput && !improvedPrompt)}
          >
            <RefreshCw className="mr-2 h-5 w-5" /> Limpiar
          </Button>
          <Button 
            type="button" 
            onClick={handleImprovePrompt} 
            className="w-full sm:w-auto btn-subtle-hover text-lg py-3 px-6"
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-6 w-6" />
            )}
            Mejorar Prompt
          </Button>
        </div>

        {improvedPrompt && (
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xl font-semibold text-accent-foreground">Prompt Mejorado:</h3>
              <Button
                variant="ghost"
                size="sm" 
                className="text-muted-foreground hover:text-primary btn-subtle-hover px-3 py-1"
                onClick={() => handleCopy(improvedPrompt, 'mejorado')}
                aria-label="Copiar prompt mejorado"
              >
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
            </div>
            <Textarea
              id="improvedPromptOutput"
              value={improvedPrompt}
              readOnly
              rows={6}
              className="w-full p-3 border rounded-lg bg-input/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none text-base"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
