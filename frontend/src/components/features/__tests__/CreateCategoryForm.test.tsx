import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateCategoryForm } from '../CreateCategoryForm';
import * as useCategoryMutations from '@/hooks/useCategoryMutations';
import { VALIDATION_RULES } from '@/lib/constants';

jest.mock('@/hooks/useCategoryMutations');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CreateCategoryForm', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCategoryMutations.useCreateCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });
  });

  it('should render form with all elements', () => {
    render(<CreateCategoryForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText('Category Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter category name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument();
  });

  it('should display cancel button when onCancel prop is provided', () => {
    const mockOnCancel = jest.fn();
    render(<CreateCategoryForm onCancel={mockOnCancel} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should not display cancel button when onCancel is not provided', () => {
    render(<CreateCategoryForm />, { wrapper: createWrapper() });

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('should validate empty name requirement', async () => {
    const user = userEvent.setup();
    render(<CreateCategoryForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /create category/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(VALIDATION_RULES.CATEGORY_NAME.MIN_LENGTH_MESSAGE)
      ).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should validate maximum length requirement', async () => {
    const user = userEvent.setup();
    render(<CreateCategoryForm />, { wrapper: createWrapper() });

    const input = screen.getByPlaceholderText('Enter category name');
    const submitButton = screen.getByRole('button', { name: /create category/i });

    const longName = 'A'.repeat(VALIDATION_RULES.CATEGORY_NAME.MAX_LENGTH + 1);
    await user.type(input, longName);
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(VALIDATION_RULES.CATEGORY_NAME.MAX_LENGTH_MESSAGE)
      ).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should trim whitespace from category name', async () => {
    const user = userEvent.setup();
    render(<CreateCategoryForm />, { wrapper: createWrapper() });

    const input = screen.getByPlaceholderText('Enter category name');
    const submitButton = screen.getByRole('button', { name: /create category/i });

    await user.type(input, '  Food  ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ name: 'Food' }, expect.any(Object));
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();

    render(<CreateCategoryForm onSuccess={mockOnSuccess} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Enter category name');
    const submitButton = screen.getByRole('button', { name: /create category/i });

    await user.type(input, 'Transport');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { name: 'Transport' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      );
    });
  });

  it('should reset form and call onSuccess after successful submission', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();

    mockMutate.mockImplementation((_data, options) => {
      options.onSuccess();
    });

    render(<CreateCategoryForm onSuccess={mockOnSuccess} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Enter category name');
    const submitButton = screen.getByRole('button', { name: /create category/i });

    await user.type(input, 'Food');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  it('should display loading state when submitting', () => {
    (useCategoryMutations.useCreateCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    });

    render(<CreateCategoryForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when mutation fails', () => {
    const mockError = {
      detail: { code: 'duplicate_name', message: 'Category already exists' },
    };
    (useCategoryMutations.useCreateCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    });

    render(<CreateCategoryForm />, { wrapper: createWrapper() });

    expect(screen.getByRole('alert')).toHaveTextContent('Category already exists');
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCancel = jest.fn();

    render(<CreateCategoryForm onCancel={mockOnCancel} />, {
      wrapper: createWrapper(),
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
