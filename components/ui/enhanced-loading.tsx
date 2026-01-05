'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Composant de loading skeleton moderne
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular', 
  animation = 'wave',
  lines = 1
}: SkeletonProps) {
  const baseClasses = cn(
    "bg-gray-200 dark:bg-gray-800",
    animation === 'pulse' && "animate-pulse",
    animation === 'wave' && "skeleton-box",
    className
  );

  switch (variant) {
    case 'text':
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }, (_, i) => (
            <div 
              key={i} 
              className={cn(baseClasses, "h-4 rounded", i === lines - 1 && "w-3/4")} 
            />
          ))}
        </div>
      );
    case 'circular':
      return <div className={cn(baseClasses, "rounded-full aspect-square")} />;
    case 'card':
      return (
        <div className={cn("border border-gray-200 rounded-lg p-4 space-y-4", className)}>
          <Skeleton variant="circular" className="w-12 h-12" />
          <Skeleton variant="text" lines={3} />
        </div>
      );
    default:
      return <div className={cn(baseClasses, "rounded")} />;
  }
}

// Composant de chargement avec indicateur de progression
interface EnhancedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'bars' | 'thai';
  message?: string;
  progress?: number; // 0-100
  className?: string;
}

export function EnhancedLoader({ 
  size = 'md', 
  variant = 'spinner',
  message,
  progress,
  className 
}: EnhancedLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  };

  const messageSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Loader2 className={cn(sizeClasses[size], "animate-spin text-thai-orange")} />;
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className={cn(
                  "bg-thai-orange rounded-full animate-bounce",
                  size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i}
                className={cn(
                  "bg-thai-orange animate-pulse",
                  size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-2 h-8' : 'w-3 h-12'
                )}
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        );
      
      case 'thai':
        return (
          <div className="relative">
            <div className={cn(sizeClasses[size], "border-4 border-thai-cream border-t-thai-orange rounded-full animate-spin")} />
            <div className="absolute inset-2 bg-thai-gold rounded-full opacity-50 animate-ping" />
          </div>
        );
      
      default:
        return <Loader2 className={cn(sizeClasses[size], "animate-spin text-thai-orange")} />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {renderLoader()}
      
      {message && (
        <p className={cn(messageSize[size], "text-thai-green font-medium text-center")}>
          {message}
        </p>
      )}
      
      {typeof progress === 'number' && (
        <div className="w-full max-w-xs">
          <div className="bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-thai-orange h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <p className="text-center text-xs text-thai-green/70 mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}

// Hook pour détecter l'état de connexion
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
}

// Indicateur de connexion
export function ConnectionIndicator({ className }: { className?: string }) {
  const isOnline = useOnlineStatus();

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-300",
      isOnline ? "translate-y-20 opacity-0" : "translate-y-0 opacity-100",
      className
    )}>
      <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Connexion perdue</span>
      </div>
    </div>
  );
}

// Composant de transition de page
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn(
      "transition-all duration-500 ease-out",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      className
    )}>
      {children}
    </div>
  );
}