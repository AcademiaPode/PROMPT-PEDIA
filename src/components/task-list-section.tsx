import type { Task, TaskCategory } from '@/lib/tasks';
import { tasks, taskCategories } from '@/lib/tasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button'; // No se usa Button aquí
import { cn } from '@/lib/utils';

interface TaskListSectionProps {
  onTaskSelect: (task: Task) => void;
}

export function TaskListSection({ onTaskSelect }: TaskListSectionProps) {
  
  const categorizedTasks = taskCategories.map(category => ({
    name: category,
    tasks: tasks.filter(task => task.category === category),
  })).filter(categoryGroup => categoryGroup.tasks.length > 0);

  return (
    <section id="taskListCardsSection" className="w-full space-y-8">
      {/* El header se movió a page.tsx */}
      
      {categorizedTasks.map((categoryGroup, groupIndex) => (
        <div key={categoryGroup.name} className="mb-6">
          <h3 className="text-2xl font-semibold mb-5 text-foreground ml-1 animate-slideInLeft" style={{ animationDelay: `${0.5 + groupIndex * 0.1}s` }}>{categoryGroup.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryGroup.tasks.map((task, taskIndex) => (
              <Card 
                key={task.id}
                className="bg-card/80 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer group hover:border-accent/70 border-transparent border-2 hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${0.6 + groupIndex * 0.1 + taskIndex * 0.05}s` }}
                onClick={() => onTaskSelect(task)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onTaskSelect(task);}}
                role="button"
                aria-label={`Seleccionar tarea: ${task.name}`}
              >
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3 pt-5 px-5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <task.icon className="w-8 h-8 text-primary transition-colors" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{task.name}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3">{task.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
