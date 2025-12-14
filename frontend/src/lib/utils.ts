export const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const getActiveStatusBadge = (isActive: boolean) => ({
  variant: (isActive ? 'success' : 'inactive') as 'success' | 'inactive',
  text: isActive ? 'Active' : 'Inactive',
});
