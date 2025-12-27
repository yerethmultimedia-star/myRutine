import { ColorMode, getColors, baseColors, stateColors } from './colors';
import { Platform } from 'react-native';

export interface Theme {
  mode: ColorMode;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  state: {
    taskCompleted: string;
    taskPending: string;
    taskOverdue: string;
    taskPaused: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    priorityCritical: string;
    difficultyEasy: string;
    difficultyMedium: string;
    difficultyHard: string;
    difficultyVeryHard: string;
    difficultyExtreme: string;
  };
  background: {
    primary: string;
    surface: string;
    surfaceElevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  ui: {
    border: string;
    divider: string;
    overlay: string;
    shadow: string;
    pressed: string;
    disabled: string;
    disabledText: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: any;
    md: any;
    lg: any;
  };
}

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const typography = {
  fontFamily: {
    regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }) as string,
    medium: Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' }) as string,
    semibold: Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' }) as string,
    bold: Platform.select({ ios: 'System', android: 'Roboto-Bold', default: 'System' }) as string,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const createTheme = (mode: ColorMode): Theme => {
  const colors = getColors(mode);
  
  return {
    mode,
    colors: {
      primary: baseColors.primary,
      secondary: baseColors.secondary,
      success: baseColors.success,
      error: baseColors.error,
      warning: baseColors.warning,
      info: baseColors.info,
    },
    state: {
      taskCompleted: stateColors.taskCompleted,
      taskPending: stateColors.taskPending,
      taskOverdue: stateColors.taskOverdue,
      taskPaused: stateColors.taskPaused,
      priorityLow: stateColors.priorityLow,
      priorityMedium: stateColors.priorityMedium,
      priorityHigh: stateColors.priorityHigh,
      priorityCritical: stateColors.priorityCritical,
      difficultyEasy: stateColors.difficultyEasy,
      difficultyMedium: stateColors.difficultyMedium,
      difficultyHard: stateColors.difficultyHard,
      difficultyVeryHard: stateColors.difficultyVeryHard,
      difficultyExtreme: stateColors.difficultyExtreme,
    },
    background: {
      primary: colors.background,
      surface: colors.surface,
      surfaceElevated: colors.surfaceElevated,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      tertiary: colors.textTertiary,
      inverse: colors.textInverse,
    },
    ui: {
      border: colors.border,
      divider: colors.divider,
      overlay: colors.overlay,
      shadow: colors.shadow,
      pressed: colors.pressed,
      disabled: colors.disabled,
      disabledText: colors.disabledText,
    },
    spacing,
    typography,
    borderRadius,
    shadows: {
      sm: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      md: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      },
      lg: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
      },
    },
  };
};

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');
