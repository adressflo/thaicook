/**
 * Production-safe logging utility
 * Only logs in development environment or when explicitly enabled
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (message: any, ...args: any[]) => void;
  info: (message: any, ...args: any[]) => void;
  warn: (message: any, ...args: any[]) => void;
  error: (message: any, ...args: any[]) => void;
}

const createLogger = (): Logger => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLoggingEnabled = process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true';
  
  const shouldLog = isDevelopment || isLoggingEnabled;

  const log = (level: LogLevel, message: any, ...args: any[]) => {
    if (!shouldLog) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  };

  return {
    debug: (message: any, ...args: any[]) => log('debug', message, ...args),
    info: (message: any, ...args: any[]) => log('info', message, ...args),
    warn: (message: any, ...args: any[]) => log('warn', message, ...args),
    error: (message: any, ...args: any[]) => log('error', message, ...args),
  };
};

export const logger = createLogger();

// Helper function for development-only logging
export const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV]', ...args);
  }
};