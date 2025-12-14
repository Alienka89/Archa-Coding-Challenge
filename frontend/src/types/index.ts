export interface Category {
  id: number;
  name: string;
  is_active: boolean;
}

export interface ExpenseCode {
  id: number;
  category_id: number;
  code: string;
  description: string | null;
  is_active: boolean;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
  is_active?: boolean;
}

export interface CreateExpenseCodeDto {
  code: string;
  description?: string;
}

export interface UpdateExpenseCodeDto {
  description?: string;
  is_active?: boolean;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  errors?: Array<{
    loc: Array<string | number>;
    msg: string;
    type: string;
  }>;
}

export interface ApiError {
  detail: ApiErrorDetail;
}
