import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CategoryList } from '../CategoryList';
import * as useCategories from '@/hooks/useCategories';
import type { Category } from '@/types';

jest.mock('@/hooks/useCategories');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CategoryList', () => {
  const mockCategories: Category[] = [
    { id: 1, name: 'Food', is_active: true },
    { id: 2, name: 'Transport', is_active: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading skeletons when loading', () => {
    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { container } = render(<CategoryList />, { wrapper: createWrapper() });

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(5);
  });

  it('should display error message when fetch fails', () => {
    const mockError = { detail: 'Failed to load categories' };
    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    render(<CategoryList />, { wrapper: createWrapper() });

    expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
    expect(screen.getByText('Failed to load categories')).toHaveClass('text-red-400');
  });

  it('should display empty state when no categories exist', () => {
    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<CategoryList />, { wrapper: createWrapper() });

    expect(screen.getByText('No categories found')).toBeInTheDocument();
    expect(
      screen.getByText('Create your first category to get started')
    ).toBeInTheDocument();
  });

  it('should display list of categories', () => {
    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });

    render(<CategoryList />, { wrapper: createWrapper() });

    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('should highlight selected category', () => {
    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CategoryList selectedCategoryId={1} />, {
      wrapper: createWrapper(),
    });

    const selectedCard = container.querySelector('.border-blue-500');
    expect(selectedCard).toBeInTheDocument();
    expect(selectedCard).toHaveTextContent('Food');
  });

  it('should call onCategorySelect when category is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();

    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });

    render(<CategoryList onCategorySelect={mockOnSelect} />, {
      wrapper: createWrapper(),
    });

    const foodCategory = screen.getByText('Food');
    await user.click(foodCategory);

    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  it('should switch to edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();

    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });

    render(<CategoryList />, { wrapper: createWrapper() });

    const editButtons = screen.getAllByLabelText('Edit category');
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument();
    });
  });

  it('should display active and inactive badges correctly', () => {
    (useCategories.useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });

    render(<CategoryList />, { wrapper: createWrapper() });

    const badges = screen.getAllByText(/Active|Inactive/);
    expect(badges[0]).toHaveTextContent('Active');
    expect(badges[1]).toHaveTextContent('Inactive');
  });
});
