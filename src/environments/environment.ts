export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api',
  apiVersion: 'v1',
  signalRUrl: 'http://localhost:5000/hubs/gamification',
  
  // Feature flags
  enableMockData: true,
  enableLogging: true,
  enableAnalytics: false,
  
  // Cache configuration
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
  
  // Auth
  tokenStorageKey: 'rotinik_auth_token',
  refreshTokenStorageKey: 'rotinik_refresh_token',
  
  // Mock data
  mockUser: {
    id: '1',
    email: 'demo@rotinik.com',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  },
};
