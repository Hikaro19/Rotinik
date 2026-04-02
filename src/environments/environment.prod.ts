export const environment = {
  production: true,
  apiBaseUrl: 'https://api.rotinik.com/api',
  apiVersion: 'v1',
  signalRUrl: 'https://api.rotinik.com/hubs/gamification',
  
  // Feature flags
  enableMockData: false,
  enableLogging: false,
  enableAnalytics: true,
  
  // Cache configuration
  cacheExpiry: 10 * 60 * 1000, // 10 minutes
  
  // Auth
  tokenStorageKey: 'rotinik_auth_token',
  refreshTokenStorageKey: 'rotinik_refresh_token',
};
