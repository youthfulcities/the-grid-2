const ageMap = (age: number | null): string | undefined => {
  if (age === null) {
    return undefined;
  }
  if (age >= 15 && age <= 19) {
    return '15 to 19 years';
  }
  if (age >= 20 && age <= 24) {
    return '20 to 24 years';
  }
  if (age >= 15 && age <= 19) {
    return '15 to 19 years';
  }
  if (age >= 25 && age <= 29) {
    return '25 to 29 years';
  }
  return undefined;
};

export default ageMap;
