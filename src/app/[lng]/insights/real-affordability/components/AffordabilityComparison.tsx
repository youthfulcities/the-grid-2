import CompareCities from '@/app/components/CompareCities';

const AffordabilityComparison = () => {
  const cityList = ['Toronto'];
  return (
    <CompareCities
      allCities={cityList}
      renderCard={(city, activeCity) => <div>Test</div>}
    />
  );
};

export default AffordabilityComparison;
