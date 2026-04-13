import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { APIRequestError } from '@/lib/api/client';

export function useOfflineErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown) => {
    if (error instanceof APIRequestError) {
      if (error.errorCode === 'OFFLINE') {
        toast({
          title: 'Offline',
          description: 'Request queued. Will sync when you are online.',
          variant: 'default',
        });
        return true;
      }

      if (error.statusCode === 0 || error.message.includes('offline')) {
        toast({
          title: 'Connection Error',
          description: 'Unable to reach the server. Please check your connection.',
          variant: 'destructive',
        });
        return true;
      }
    }

    return false;
  }, [toast]);

  return { handleError };
}
