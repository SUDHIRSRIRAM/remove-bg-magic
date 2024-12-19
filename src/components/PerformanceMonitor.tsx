import { useEffect } from 'react';
import { trackTiming, trackException } from '@/utils/analytics';

export const PerformanceMonitor = () => {
  useEffect(() => {
    try {
      // Monitor page load performance
      if (window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          trackTiming(
            'Page Load',
            'DOM Complete',
            Math.round(navigation.domComplete),
          );
          
          trackTiming(
            'Page Load',
            'First Contentful Paint',
            Math.round(navigation.responseStart),
          );
        }

        // Monitor long tasks
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              trackTiming(
                'Long Task',
                'Duration',
                Math.round(entry.duration),
                entry.name
              );
            }
          });
        });

        observer.observe({ entryTypes: ['longtask'] });

        // Monitor memory usage
        if (performance.memory) {
          setInterval(() => {
            trackTiming(
              'Memory',
              'Heap Size',
              Math.round(performance.memory.usedJSHeapSize / 1048576), // Convert to MB
            );
          }, 60000); // Check every minute
        }
      }
    } catch (error) {
      trackException(`Performance monitoring error: ${error}`);
      console.error('Performance monitoring error:', error);
    }
  }, []);

  return null;
};