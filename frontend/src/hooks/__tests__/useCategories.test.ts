import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCategories } from '../useCategories';
import * as categoriesApi from '@/api/categories';
import type { Category } from '@/types';

jest.mock('@/api/categories');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useCategories', () => {
  const mockCategories: Category[] = [
    { id: 1, name: 'Food', is_active: true },
    { id: 2, name: 'Transport', is_active: true },
    { id: 3, name: 'Entertainment', is_active: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch categories successfully', async () => {
    (categoriesApi.getCategories as jest.Mock).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCategories);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle error when fetching categories fails', async () => {
    const mockError = new Error('Failed to fetch categories');
    (categoriesApi.getCategories as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty array when no categories exist', async () => {
    (categoriesApi.getCategories as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
