import type { ApiError } from '@/types';
import { ERROR_MESSAGES } from '@/lib/constants';

export const useErrorMessage = (
  error: Error | ApiError | null | undefined,
  fallbackMessage: string = ERROR_MESSAGES.UNKNOWN_ERROR
): string | undefined => {
  if (!error) return undefined;

  if ('detail' in error && error.detail && typeof error.detail === 'object') {
    if ('message' in error.detail) {
      return error.detail.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
