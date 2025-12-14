export const QUERY_KEYS = {
  CATEGORIES: ['categories'] as const,
  EXPENSE_CODES: (categoryId: number) => ['expense-codes', categoryId] as const,
} as const;

export const VALIDATION_RULES = {
  CATEGORY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 120,
    REQUIRED_MESSAGE: 'Category name is required',
    MIN_LENGTH_MESSAGE: 'Category name must be at least 1 character',
    MAX_LENGTH_MESSAGE: 'Category name must be at most 120 characters',
  },
  CODE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 64,
    REQUIRED_MESSAGE: 'Code is required',
    MIN_LENGTH_MESSAGE: 'Code must be at least 1 character',
    MAX_LENGTH_MESSAGE: 'Code must be at most 64 characters',
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
    MAX_LENGTH_MESSAGE: 'Description must be at most 500 characters',
  },
} as const;

export const ERROR_MESSAGES = {
  CREATE_CATEGORY_FAILED: 'Failed to create category',
  UPDATE_CATEGORY_FAILED: 'Failed to update category',
  LOAD_CATEGORIES_FAILED: 'Failed to load categories',
  CREATE_CODE_FAILED: 'Failed to create code',
  UPDATE_CODE_FAILED: 'Failed to update code',
  LOAD_CODES_FAILED: 'Failed to load expense codes',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;
