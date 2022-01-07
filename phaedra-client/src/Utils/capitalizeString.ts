export const capitalize = (string: string): string => {
  if (typeof string !== 'string') return '';
  const decapitalizeString = string.toLowerCase();
  return string.charAt(0).toUpperCase() + decapitalizeString.slice(1);
};

export const decapitalize = (string: string): string => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toLowerCase() + string.slice(1);
};
