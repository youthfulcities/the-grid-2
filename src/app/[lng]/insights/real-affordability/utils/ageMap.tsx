const ageMap = (
  age: number | null,
  locale: string = 'en'
): string | undefined => {
  if (age === null) return undefined;

  const ranges = [
    { min: 15, max: 19, label: { en: '15 to 19 years', fr: '15 à 19 ans' } },
    { min: 20, max: 24, label: { en: '20 to 24 years', fr: '20 à 24 ans' } },
    { min: 25, max: 29, label: { en: '25 to 29 years', fr: '25 à 29 ans' } },
    // Add more ranges here as needed
  ];

  const range = ranges.find((r) => age >= r.min && age <= r.max);
  return range?.label[locale as 'fr' | 'en'] || undefined;
};

export default ageMap;
