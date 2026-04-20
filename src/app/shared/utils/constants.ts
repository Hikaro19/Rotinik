/**
 * Constantes da aplicação
 */

// ============================================================================
// 🎮 GAMIFICATION CONSTANTS
// ============================================================================

export const GAMIFICATION = {
  LEVELS: {
    MIN_XP_PER_LEVEL: 100,
    MAX_LEVEL: 100,
  },
  ACHIEVEMENTS: {
    FIRST_TASK: 'first-task',
    WEEK_STREAK_7: 'week-streak-7',
    WEEK_STREAK_30: 'week-streak-30',
    COMPLETE_ALL: 'complete-all',
  },
  RANKS: [
    'Aprendiz',
    'Aprendiz Determinado',
    'Guerreiro da Rotina',
    'Mestre da Consistência',
    'Lenda do Hábito',
    'Herói Indomável',
  ],
} as const;

// ============================================================================
// 📊 VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MIN_STRENGTH: 'medium',
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    REGEX: /^[a-zA-Z0-9_-]+$/,
  },
} as const;

// ============================================================================
// ⏱️ TIMING CONSTANTS
// ============================================================================

export const TIMING = {
  ANIMATION_DURATION: 300,
  TRANSITION_FAST: 150,
  TRANSITION_BASE: 200,
  TRANSITION_SLOW: 300,
  DEBOUNCE_TIME: 300,
  THROTTLE_TIME: 1000,
} as const;

// ============================================================================
// 📍 ROUTES CONSTANTS
// ============================================================================

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  APP: {
    HOME: '/home',
    ROUTINES: '/routines',
    SHOP: '/shop',
    FRIENDS: '/friends',
    PROFILE: '/profile',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
  },
} as const;

// ============================================================================
// 🔐 AUTH CONSTANTS
// ============================================================================

export const AUTH = {
  TOKEN_KEY: 'rotinik_auth_token',
  REFRESH_TOKEN_KEY: 'rotinik_refresh_token',
  USER_KEY: 'rotinik_user',
  TOKEN_EXPIRY_KEY: 'rotinik_token_expiry',
} as const;

// ============================================================================
// 📱 BREAKPOINTS CONSTANTS
// ============================================================================

export const BREAKPOINTS = {
  XS: 320,
  SM: 480,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ============================================================================
// 🌈 THEME CONSTANTS
// ============================================================================

export const THEME = {
  COLORS: {
    PRIMARY: '#00ff88',
    PRIMARY_DARK: '#00cc6a',
    SECONDARY: '#00d4ff',
    DANGER: '#ff4444',
    SUCCESS: '#00ff88',
    WARNING: '#ffaa00',
    INFO: '#00d4ff',
    BACKGROUND: '#0a0e27',
    SURFACE: '#131829',
  },
  SPACING: [
    '0',
    '4px',
    '8px',
    '12px',
    '16px',
    '20px',
    '24px',
    '32px',
    '40px',
    '48px',
    '64px',
  ],
} as const;

// ============================================================================
// 📊 API CONSTANTS
// ============================================================================

export const API = {
  // Use environment.ts para API_BASE_URL
  BASE_URL: 'http://localhost:5000/api',
  VERSION: 'v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// ============================================================================
// 🎯 REGEX PATTERNS
// ============================================================================

export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  NUMERIC: /^\d+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
} as const;

// ============================================================================
// 💾 STORAGE CONSTANTS
// ============================================================================

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'rotinik_user_preferences',
  NOTIFICATION_SETTINGS: 'rotinik_notification_settings',
  THEME: 'rotinik_theme',
  LANGUAGE: 'rotinik_language',
} as const;

// ============================================================================
// 📧 EMAIL CONSTANTS
// ============================================================================

export const EMAIL = {
  SUPPORT: 'support@rotinik.com',
  NOREPLY: 'noreply@rotinik.com',
  CONTACT: 'contact@rotinik.com',
} as const;

// ============================================================================
// 🔔 NOTIFICATION TYPES
// ============================================================================

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// ============================================================================
// 📝 PAGINATION CONSTANTS
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MIN_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [5, 10, 20, 50, 100],
} as const;
