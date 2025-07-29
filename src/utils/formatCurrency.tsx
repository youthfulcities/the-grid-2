export default function formatCurrency(
  value: number,
  locale: string = 'en-CA',
  currency: string = 'CAD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
