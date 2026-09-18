import { useState, useEffect } from 'react';
import { timeTrackingService } from '../services/timeTrackingService';

export function useTimeTracking() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = timeTrackingService.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  return timeTrackingService;
}
