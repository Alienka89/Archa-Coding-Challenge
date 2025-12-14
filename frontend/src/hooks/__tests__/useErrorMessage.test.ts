import { renderHook } from '@testing-library/react';
import { useErrorMessage } from '../useErrorMessage';
import { ERROR_MESSAGES } from '@/lib/constants';
import type { ApiError } from '@/types';

describe('useErrorMessage', () => {
  it('should return undefined when error is null', () => {
    const { result } = renderHook(() => useErrorMessage(null));
    expect(result.current).toBeUndefined();
  });

  it('should return undefined when error is undefined', () => {
    const { result } = renderHook(() => useErrorMessage(undefined));
    expect(result.current).toBeUndefined();
  });

  it('should return detail message from ApiError', () => {
    const apiError: ApiError = {
      detail: { code: 'not_found', message: 'Category not found' },
    };
    const { result } = renderHook(() => useErrorMessage(apiError));
    expect(result.current).toBe('Category not found');
  });

  it('should return message from Error instance', () => {
    const error = new Error('Network error');
    const { result } = renderHook(() => useErrorMessage(error));
    expect(result.current).toBe('Network error');
  });

  it('should return fallback message for unknown error type', () => {
    const unknownError = { unknown: 'field' } as unknown as Error;
    const { result } = renderHook(() => useErrorMessage(unknownError, 'Custom fallback'));
    expect(result.current).toBe('Custom fallback');
  });

  it('should use default fallback message when not provided', () => {
    const unknownError = { unknown: 'field' } as unknown as Error;
    const { result } = renderHook(() => useErrorMessage(unknownError));
    expect(result.current).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
  });

  it('should prioritize detail over Error message', () => {
    const errorWithDetail = Object.assign(new Error('Error message'), {
      detail: { code: 'api_error', message: 'API detail message' },
    });
    const { result } = renderHook(() => useErrorMessage(errorWithDetail));
    expect(result.current).toBe('API detail message');
  });
});
