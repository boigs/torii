export const validateNonEmpty = (
  value: string,
  fieldName: string
): string | null => {
  if (!value) {
    return `${fieldName} is required`;
  }
  return null;
};
