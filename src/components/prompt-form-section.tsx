// src/components/prompt-form-section.tsx
"use client";

import type { Task, FormField as TaskFormField } from '@/lib/tasks';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2, Wand2 } from 'lucide-react';
import { improvePromptQuality, type ImprovePromptQualityInput } from '@/ai/flows/improve-prompt-quality';
import { useToast } from '@/hooks/use-toast';

interface PromptFormSectionProps {
  task: Task;
  onBack: () => void;
  onPromptGenerated: (prompt: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

// Dynamically create Zod schema from task fields
const createSchema = (fields: TaskFormField[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  fields.forEach(field => {
    let zodField: z.ZodTypeAny;
    switch (field.type) {
      case 'textarea':
      case 'text':
        zodField = z.string();
        if (field.required) {
          zodField = zodField.min(1, `${field.label} es requerido.`);
        } else {
          zodField = zodField.optional();
        }
        break;
      case 'select':
        zodField = z.string();
        if (field.required) {
          zodField = zodField.min(1, `${field.label} es requerido.`);
        } else {
          zodField = zodField.optional();
        }
        break;
      default:
        zodField = z.any();
    }
    schemaFields[field.id] = zodField;
  });
  return z.object(schemaFields);
};


export function PromptFormSection({ task, onBack, onPromptGenerated, setIsLoading, isLoading }: PromptFormSectionProps) {
  const { toast } = useToast();
  const validationSchema = createSchema(task.fields);
  
  const defaultValues: Record<string, any> = {};
  task.fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      defaultValues[field.id] = field.defaultValue;
    } else if (field.type === 'select' && field.options && field.options.length > 0) {
      // Default to first option if no default value is provided for select
      // defaultValues[field.id] = field.options[0].value;
    } else {
      defaultValues[field.id] = '';
    }
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
    setIsLoading(true);
    try {
      const basePrompt = task.promptTemplate(data);
      const aiInput: ImprovePromptQualityInput = { prompt: basePrompt };
      const result = await improvePromptQuality(aiInput);
      onPromptGenerated(result.improvedPrompt);
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el prompt. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card id="formSection" className="w-full max-w-2xl mx-auto shadow-xl border-accent/30 card-subtle-hover">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <task.icon className="h-10 w-10 text-primary" />
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">{task.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{task.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div id="formFields" className="space-y-4">
            {task.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="font-medium text-foreground/90">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: controllerField }) => {
                    switch (field.type) {
                      case 'textarea':
                        return <Textarea {...controllerField} id={field.id} placeholder={field.placeholder} rows={4} className="resize-none bg-input focus:ring-ring"/>;
                      case 'select':
                        return (
                          <Select onValueChange={controllerField.onChange} defaultValue={controllerField.value}>
                            <SelectTrigger id={field.id} className="bg-input focus:ring-ring">
                              <SelectValue placeholder={field.placeholder || 'Selecciona una opción'} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      case 'text':
                      default:
                        return <Input {...controllerField} id={field.id} placeholder={field.placeholder} className="bg-input focus:ring-ring"/>;
                    }
                  }}
                />
                {errors[field.id] && <p className="text-sm text-destructive">{errors[field.id]?.message as string}</p>}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-border/50">
            <Button type="button" id="backButton" onClick={onBack} variant="secondary" className="w-full sm:w-auto btn-subtle-hover" disabled={isLoading}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Tareas
            </Button>
            <Button type="submit" className="w-full sm:w-auto btn-subtle-hover text-lg py-3 px-6" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-6 w-6" />
              )}
              Generar Prompt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
