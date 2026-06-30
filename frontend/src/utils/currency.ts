export const formatNpr = (value: number): string => {
  const roundedValue = Math.round(value);
  return `NPR ${new Intl.NumberFormat('en-IN').format(roundedValue)}`;
};