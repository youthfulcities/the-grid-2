type FormatStyle = 'decimal' | 'currency' | 'percent';

interface FormatNumberOptions {
  locale?: string;
  style?: FormatStyle;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
}

export default function formatNumber(
  value: number,
  locale = 'en',
  {
    style = 'currency',
    currency = 'CAD',
    minimumFractionDigits,
    maximumFractionDigits,
    compact = false,
  }: FormatNumberOptions = {}
): string {
  const options: Intl.NumberFormatOptions = {
    style,
    currency,
    currencyDisplay: 'narrowSymbol',
    ...(typeof minimumFractionDigits === 'number' && { minimumFractionDigits }),
    ...(typeof maximumFractionDigits === 'number' && { maximumFractionDigits }),
    ...(compact && { notation: 'compact' }),
  };

  return new Intl.NumberFormat(locale, options).format(value);
}
