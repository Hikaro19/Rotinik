export const environment = {
  production: false,
  apiUrl: 'http://localhost:5206/api',
  apiBaseUrl: 'http://localhost:5206/api',
  apiVersion: 'v1',
  signalRUrl: 'http://localhost:5206/hubs/gamification',

  // Feature flags
  enableMockData: false,
  enableLogging: true,
  enableAnalytics: false,

  // Cache configuration
  cacheExpiry: 5 * 60 * 1000,

  // Auth
  tokenStorageKey: 'rotinik_auth_token',
  refreshTokenStorageKey: 'rotinik_refresh_token',
};
