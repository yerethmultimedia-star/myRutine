/**
 * Sistema de Colores Centralizado - myRutine
 * Soporta modo claro y oscuro con accesibilidad WCAG AA
 */

// Colores base (constantes en ambos modos)
export const baseColors = {
  primary: '#4F46E5', // Indigo-600 - Progreso / CTA
  secondary: '#F59E0B', // Amber-500 - Logros / Recompensas
  success: '#16A34A', // Green-600 - Tareas completadas
  error: '#DC2626', // Red-600 - Tareas vencidas / Alertas
  warning: '#F59E0B', // Amber-500 - Advertencias
  info: '#2563EB', // Blue-600 - Información
} as const;

// Colores adicionales para estados
export const stateColors = {
  // Estados de tareas
  taskCompleted: baseColors.success,
  taskPending: '#94A3B8', // Slate-400
  taskOverdue: baseColors.error,
  taskPaused: '#F59E0B', // Amber-500
  
  // Prioridades
  priorityLow: '#10B981', // Green-500
  priorityMedium: '#F59E0B', // Amber-500
  priorityHigh: '#F97316', // Orange-500
  priorityCritical: baseColors.error,
  
  // Dificultades
  difficultyEasy: '#10B981',
  difficultyMedium: '#3B82F6',
  difficultyHard: '#F59E0B',
  difficultyVeryHard: '#F97316',
  difficultyExtreme: baseColors.error,
} as const;

// Modo Claro
export const lightColors = {
  // Backgrounds
  background: '#F9FAFB', // Gray-50
  surface: '#FFFFFF', // White
  surfaceElevated: '#FFFFFF', // White (para cards elevadas)
  
  // Textos
  textPrimary: '#111827', // Gray-900
  textSecondary: '#6B7280', // Gray-500
  textTertiary: '#9CA3AF', // Gray-400
  textInverse: '#FFFFFF', // White (para texto sobre fondos oscuros)
  
  // Bordes y divisores
  border: '#E5E7EB', // Gray-200
  divider: '#E5E7EB', // Gray-200
  
  // Overlay y sombras
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Estados de interacción
  pressed: '#F3F4F6', // Gray-100
  disabled: '#D1D5DB', // Gray-300
  disabledText: '#9CA3AF', // Gray-400
} as const;

// Modo Oscuro
export const darkColors = {
  // Backgrounds
  background: '#0F172A', // Slate-900
  surface: '#1E293B', // Slate-800
  surfaceElevated: '#334155', // Slate-700 (para cards elevadas)
  
  // Textos
  textPrimary: '#F8FAFC', // Slate-50
  textSecondary: '#94A3B8', // Slate-400
  textTertiary: '#64748B', // Slate-500
  textInverse: '#0F172A', // Slate-900 (para texto sobre fondos claros)
  
  // Bordes y divisores
  border: '#334155', // Slate-700
  divider: '#334155', // Slate-700
  
  // Overlay y sombras
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  // Estados de interacción
  pressed: '#334155', // Slate-700
  disabled: '#475569', // Slate-600
  disabledText: '#64748B', // Slate-500
} as const;

// Tipos TypeScript
export type ColorMode = 'light' | 'dark';
export type BaseColors = typeof baseColors;
export type LightColors = typeof lightColors;
export type DarkColors = typeof darkColors;

// Función para obtener colores según el modo
export const getColors = (mode: ColorMode) => ({
  ...baseColors,
  ...stateColors,
  ...(mode === 'light' ? lightColors : darkColors),
});
