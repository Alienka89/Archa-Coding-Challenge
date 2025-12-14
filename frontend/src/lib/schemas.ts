import { z } from 'zod';
import { VALIDATION_RULES } from './constants';

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      VALIDATION_RULES.CATEGORY_NAME.MIN_LENGTH,
      VALIDATION_RULES.CATEGORY_NAME.MIN_LENGTH_MESSAGE
    )
    .max(
      VALIDATION_RULES.CATEGORY_NAME.MAX_LENGTH,
      VALIDATION_RULES.CATEGORY_NAME.MAX_LENGTH_MESSAGE
    ),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      VALIDATION_RULES.CATEGORY_NAME.MIN_LENGTH,
      VALIDATION_RULES.CATEGORY_NAME.MIN_LENGTH_MESSAGE
    )
    .max(
      VALIDATION_RULES.CATEGORY_NAME.MAX_LENGTH,
      VALIDATION_RULES.CATEGORY_NAME.MAX_LENGTH_MESSAGE
    ),
  is_active: z.boolean(),
});

export const createCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(VALIDATION_RULES.CODE.MIN_LENGTH, VALIDATION_RULES.CODE.MIN_LENGTH_MESSAGE)
    .max(VALIDATION_RULES.CODE.MAX_LENGTH, VALIDATION_RULES.CODE.MAX_LENGTH_MESSAGE),
  description: z
    .string()
    .max(
      VALIDATION_RULES.DESCRIPTION.MAX_LENGTH,
      VALIDATION_RULES.DESCRIPTION.MAX_LENGTH_MESSAGE
    )
    .optional()
    .or(z.literal('')),
});

export const updateCodeSchema = z.object({
  description: z
    .string()
    .max(
      VALIDATION_RULES.DESCRIPTION.MAX_LENGTH,
      VALIDATION_RULES.DESCRIPTION.MAX_LENGTH_MESSAGE
    )
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type CreateCodeFormData = z.infer<typeof createCodeSchema>;
export type UpdateCodeFormData = z.infer<typeof updateCodeSchema>;
