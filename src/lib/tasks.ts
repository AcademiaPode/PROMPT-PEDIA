import type { LucideIcon } from 'lucide-react';
import { Lightbulb, Share2, Code2, Mail, FileText, Palette, MessageSquare, Brain } from 'lucide-react';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: FormFieldOption[];
  required?: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  fields: FormField[];
  promptTemplate: (data: Record<string, any>) => string;
}

export const taskCategories = ["Creación de Contenido", "Desarrollo", "Marketing", "Creatividad", "Productividad"] as const;
export type TaskCategory = typeof taskCategories[number];

export const tasks: Task[] = [
  {
    id: 'blog-post-idea',
    name: 'Ideas para Artículo de Blog',
    description: 'Genera ideas creativas y relevantes para tu próximo artículo de blog.',
    category: "Creación de Contenido",
    icon: Lightbulb,
    fields: [
      { id: 'topic', label: 'Tema Principal', type: 'text', placeholder: 'Ej: Inteligencia Artificial en marketing', required: true },
      { id: 'targetAudience', label: 'Público Objetivo', type: 'text', placeholder: 'Ej: Emprendedores digitales', required: true },
      { id: 'keywords', label: 'Palabras Clave (separadas por coma)', type: 'text', placeholder: 'Ej: SEO, contenido, IA', required: false },
      { id: 'angle', label: 'Ángulo o Enfoque Específico', type: 'textarea', placeholder: 'Ej: Cómo la IA puede automatizar la creación de contenido para PyMEs', required: false },
    ],
    promptTemplate: (data) => `Genera 5 ideas para un artículo de blog sobre "${data.topic}" dirigido a "${data.targetAudience}". ${data.keywords ? `Considera las palabras clave: ${data.keywords}.` : ''} ${data.angle ? `El enfoque principal debe ser: "${data.angle}".` : ''} Las ideas deben ser accionables y originales. Formato: Lista numerada con título y breve descripción para cada idea.`,
  },
  {
    id: 'social-media-post',
    name: 'Publicación para Redes Sociales',
    description: 'Crea un post atractivo para tus redes sociales.',
    category: "Creación de Contenido",
    icon: Share2,
    fields: [
      { 
        id: 'platform', 
        label: 'Plataforma', 
        type: 'select', 
        options: [
          { value: 'Twitter', label: 'Twitter/X' },
          { value: 'Instagram', label: 'Instagram' },
          { value: 'LinkedIn', label: 'LinkedIn' },
          { value: 'Facebook', label: 'Facebook' },
        ], 
        required: true,
        defaultValue: 'Twitter',
      },
      { id: 'contentType', label: 'Tipo de Contenido', type: 'select', options: [
        { value: 'Anuncio', label: 'Anuncio' },
        { value: 'Pregunta', label: 'Pregunta para la Audiencia' },
        { value: 'Consejo Rápido', label: 'Consejo Rápido' },
        { value: 'Noticia', label: 'Noticia o Actualización' },
      ], required: true, defaultValue: 'Consejo Rápido' },
      { id: 'coreMessage', label: 'Mensaje Principal', type: 'textarea', placeholder: 'Ej: Descubre cómo mejorar tu productividad...', required: true },
      { id: 'tone', label: 'Tono', type: 'select', options: [
          { value: 'Formal', label: 'Formal' },
          { value: 'Casual', label: 'Casual' },
          { value: 'Humorístico', label: 'Humorístico' },
          { value: 'Inspirador', label: 'Inspirador' },
        ], required: true, defaultValue: 'Casual'
      },
      { id: 'hashtags', label: 'Hashtags Sugeridos (opcional, separados por coma)', type: 'text', placeholder: 'Ej: #productividad, #marketingdigital' },
    ],
    promptTemplate: (data) => `Crea una publicación para ${data.platform} con el siguiente mensaje principal: "${data.coreMessage}". El tipo de contenido es "${data.contentType}" y el tono debe ser ${data.tone}. ${data.hashtags ? `Incluye hashtags relevantes como: ${data.hashtags}.` : 'Sugiere 2-3 hashtags relevantes.'} El post debe ser conciso y atractivo.`,
  },
  {
    id: 'python-function',
    name: 'Función de Python',
    description: 'Genera el esqueleto o la lógica de una función en Python.',
    category: "Desarrollo",
    icon: Code2,
    fields: [
      { id: 'functionPurpose', label: 'Propósito de la Función', type: 'textarea', placeholder: 'Ej: Calcular el factorial de un número', required: true },
      { id: 'functionName', label: 'Nombre de la Función (sugerido)', type: 'text', placeholder: 'Ej: calcular_factorial', required: true },
      { id: 'inputParameters', label: 'Parámetros de Entrada (nombre y tipo, separados por coma)', type: 'text', placeholder: 'Ej: numero (int)', required: true },
      { id: 'expectedOutput', label: 'Salida Esperada (descripción y tipo)', type: 'text', placeholder: 'Ej: El factorial del número (int)', required: true },
      { id: 'pythonVersion', label: 'Versión de Python (opcional)', type: 'select', options: [{value: '3.8', label: '3.8'}, {value: '3.9', label: '3.9'}, {value: '3.10', label: '3.10'}, {value: '3.11', label: '3.11'}, {value: 'cualquiera', label: 'Cualquiera'}], defaultValue: '3.9' },
    ],
    promptTemplate: (data) => `Escribe una función en Python llamada "${data.functionName}" (o un nombre apropiado si este no lo es) que cumpla con el siguiente propósito: "${data.functionPurpose}".
Parámetros de entrada: ${data.inputParameters}.
Salida esperada: ${data.expectedOutput}.
${data.pythonVersion !== 'cualquiera' ? `Optimizar para Python ${data.pythonVersion}.` : ''}
Incluye type hints y un docstring explicando su funcionamiento, parámetros y lo que retorna. Considera casos borde si aplica.`,
  },
  {
    id: 'email-subject-line',
    name: 'Asunto para Email',
    description: 'Crea asuntos de email persuasivos y que aumenten la tasa de apertura.',
    category: "Marketing",
    icon: Mail,
    fields: [
      { id: 'productService', label: 'Producto/Servicio Principal', type: 'text', placeholder: 'Ej: Nuevo curso de IA', required: true },
      { id: 'keyBenefit', label: 'Beneficio Clave para el Usuario', type: 'text', placeholder: 'Ej: Automatiza tareas repetitivas', required: true },
      { id: 'targetAudience', label: 'Público Objetivo del Email', type: 'text', placeholder: 'Ej: Profesionales ocupados', required: false },
      { id: 'urgencyScarcity', label: 'Elemento de Urgencia/Escasez (opcional)', type: 'text', placeholder: 'Ej: Oferta válida por 24hs' },
      { id: 'desiredTone', label: 'Tono del Asunto', type: 'select', options: [
          { value: 'directo', label: 'Directo y Conciso' },
          { value: 'curioso', label: 'Generador de Curiosidad' },
          { value: 'beneficio', label: 'Enfocado en Beneficio' },
          { value: 'urgente', label: 'Urgente' },
        ], required: true, defaultValue: 'directo'
      },
    ],
    promptTemplate: (data) => `Genera 5 asuntos de email para promocionar "${data.productService}", destacando el beneficio clave: "${data.keyBenefit}". ${data.targetAudience ? `El email está dirigido a "${data.targetAudience}".` : ''} ${data.urgencyScarcity ? `Incorpora este elemento de urgencia/escasez: "${data.urgencyScarcity}".` : ''} El tono debe ser ${data.desiredTone}. Los asuntos deben ser cortos, persuasivos y optimizados para alta tasa de apertura. Considera usar emojis si es apropiado para el tono.`,
  },
  {
    id: 'story-writing-prompt',
    name: 'Inicio de Historia Creativa',
    description: 'Obtén una chispa de inspiración para comenzar una nueva historia.',
    category: "Creatividad",
    icon: FileText,
    fields: [
      { id: 'genre', label: 'Género Principal', type: 'select', options: [
          {value: 'ciencia ficcion', label: 'Ciencia Ficción'},
          {value: 'fantasia', label: 'Fantasía'},
          {value: 'misterio', label: 'Misterio'},
          {value: 'romance', label: 'Romance'},
          {value: 'terror', label: 'Terror'},
        ], required: true, defaultValue: 'fantasia'
      },
      { id: 'mainCharacter', label: 'Breve Descripción del Protagonista (opcional)', type: 'text', placeholder: 'Ej: Un detective cansado del mundo' },
      { id: 'setting', label: 'Ambientación Principal (opcional)', type: 'text', placeholder: 'Ej: Una ciudad futurista lluviosa' },
      { id: 'keyObject', label: 'Un Objeto Clave o Misterioso (opcional)', type: 'text', placeholder: 'Ej: Un antiguo reloj que no funciona' },
    ],
    promptTemplate: (data) => `Escribe el primer párrafo (aproximadamente 100-150 palabras) de una historia de ${data.genre}. ${data.mainCharacter ? `El protagonista podría ser: "${data.mainCharacter}".` : ''} ${data.setting ? `La historia podría tomar lugar en: "${data.setting}".` : ''} ${data.keyObject ? `Un objeto importante en la historia podría ser: "${data.keyObject}".` : ''} El párrafo debe ser intrigante y establecer un tono interesante para la narración.`,
  },
  {
    id: 'logo-design-concept',
    name: 'Concepto para Diseño de Logo',
    description: 'Genera ideas conceptuales para un nuevo logo.',
    category: "Creatividad",
    icon: Palette,
    fields: [
      { id: 'companyName', label: 'Nombre de la Empresa/Marca', type: 'text', placeholder: 'Ej: AuraTech', required: true },
      { id: 'industry', label: 'Industria/Sector', type: 'text', placeholder: 'Ej: Tecnología y Bienestar', required: true },
      { id: 'coreValues', label: 'Valores Clave de la Marca (separados por coma)', type: 'text', placeholder: 'Ej: Innovación, Calma, Conexión', required: true },
      { id: 'targetAudience', label: 'Público Objetivo', type: 'text', placeholder: 'Ej: Jóvenes profesionales interesados en mindfulness', required: false },
      { id: 'desiredStyle', label: 'Estilo Deseado', type: 'select', options: [
          { value: 'minimalista', label: 'Minimalista' },
          { value: 'moderno', label: 'Moderno' },
          { value: 'jugueton', label: 'Juguetón' },
          { value: 'elegante', label: 'Elegante' },
          { value: 'retro', label: 'Retro' },
        ], required: true, defaultValue: 'moderno'
      },
      { id: 'avoidElements', label: 'Elementos a Evitar (opcional)', type: 'text', placeholder: 'Ej: Colores estridentes, tipografías complejas' },
    ],
    promptTemplate: (data) => `Genera 3 conceptos detallados para el diseño de un logo para una empresa llamada "${data.companyName}" en la industria de "${data.industry}". Los valores clave de la marca son: ${data.coreValues}. ${data.targetAudience ? `El público objetivo es: "${data.targetAudience}".` : ''} El estilo deseado es ${data.desiredStyle}. ${data.avoidElements ? `Evitar los siguientes elementos: "${data.avoidElements}".` : ''} Para cada concepto, describe:
1.  Iconografía/Símbolo principal.
2.  Paleta de colores sugerida (2-3 colores).
3.  Tipo de tipografía sugerida.
4.  Sensación general que transmite el logo.`,
  },
  {
    id: 'chatbot-greeting',
    name: 'Saludo para Chatbot',
    description: 'Crea un saludo inicial amigable y efectivo para un chatbot.',
    category: "Productividad",
    icon: MessageSquare,
    fields: [
      { id: 'chatbotPurpose', label: 'Propósito Principal del Chatbot', type: 'text', placeholder: 'Ej: Soporte técnico para software', required: true },
      { id: 'chatbotName', label: 'Nombre del Chatbot (opcional)', type: 'text', placeholder: 'Ej: Asistente Virtual' },
      { id: 'companyName', label: 'Nombre de la Empresa', type: 'text', placeholder: 'Ej: Soluciones Rápidas Inc.', required: true },
      { id: 'tone', label: 'Tono del Chatbot', type: 'select', options: [
          { value: 'amigable', label: 'Amigable y Cercano' },
          { value: 'profesional', label: 'Profesional y Directo' },
          { value: 'eficiente', label: 'Eficiente y Conciso' },
        ], required: true, defaultValue: 'amigable'
      },
      { id: 'keyCapabilities', label: 'Capacidades Clave a Mencionar (opcional, 1-2)', type: 'text', placeholder: 'Ej: Resetear contraseña, consultar FAQs' },
    ],
    promptTemplate: (data) => `Crea 3 opciones de mensaje de saludo inicial para un chatbot de "${data.companyName}" ${data.chatbotName ? `llamado "${data.chatbotName}"` : ''}. El propósito principal del chatbot es: "${data.chatbotPurpose}". El tono debe ser ${data.tone}. ${data.keyCapabilities ? `El saludo podría mencionar brevemente que puede ayudar con: "${data.keyCapabilities}".` : ''} El saludo debe ser acogedor, claro y guiar al usuario sobre cómo interactuar o qué puede esperar.`,
  },
  {
    id: 'brainstorming-session',
    name: 'Ideas para Lluvia de Ideas',
    description: 'Genera preguntas o temas para iniciar una sesión de lluvia de ideas productiva.',
    category: "Productividad",
    icon: Brain,
    fields: [
      { id: 'problemToSolve', label: 'Problema Principal a Resolver o Meta a Alcanzar', type: 'textarea', placeholder: 'Ej: Incrementar la participación de los usuarios en nuestra app móvil', required: true },
      { id: 'context', label: 'Contexto Breve (opcional)', type: 'textarea', placeholder: 'Ej: La app tiene 3 meses, el engagement ha bajado un 20%' },
      { id: 'desiredOutcome', label: 'Resultado Deseado de la Lluvia de Ideas', type: 'text', placeholder: 'Ej: 5 estrategias concretas para mejorar engagement', required: true },
      { id: 'constraints', label: 'Limitaciones o Restricciones (opcional)', type: 'text', placeholder: 'Ej: Presupuesto limitado, equipo pequeño' },
    ],
    promptTemplate: (data) => `Estoy organizando una sesión de lluvia de ideas para abordar el siguiente desafío/meta: "${data.problemToSolve}". ${data.context ? `Contexto: ${data.context}.` : ''} El resultado deseado es: "${data.desiredOutcome}". ${data.constraints ? `Tenemos las siguientes limitaciones: "${data.constraints}".` : ''} Genera 5 preguntas abiertas y estimulantes o temas de discusión para iniciar la sesión de lluvia de ideas y fomentar la creatividad del equipo. Las preguntas deben ser específicas al problema pero lo suficientemente amplias para generar múltiples ideas.`,
  },
];
