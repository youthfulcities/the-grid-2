const ageMap = (age: number): string | undefined => {
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
};

export default ageMap;
