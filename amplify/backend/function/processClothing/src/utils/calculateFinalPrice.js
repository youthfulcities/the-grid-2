const calculateFinalPrice = (
  item,
  city,
  canadian = null,
  defaultToGlobal = false
) => {
  const {
    canada_average_price: cityCanadaAveragePrice,
    not_canada_average_price: cityNotCanadaAveragePrice,
    canada_average_price_per_base: cityCanadaPricePerBase,
    not_canada_average_price_per_base: cityNotCanadaPricePerBase,
  } = city || {};

  const {
    statscan_quantity,
    most_frequent_quantity,
    canada_average_price_per_base: globalCanadaPricePerBase,
    not_canada_average_price_per_base: globalNotCanadaPricePerBase,
    canada_average_price: globalCanadaAverage,
    not_canada_average_price: globalNotCanadaAverage,
  } = item || {};

  const quantity = statscan_quantity ?? most_frequent_quantity ?? 1;

  if (canadian === null) {
    const pricePerBase =
      cityCanadaPricePerBase ??
      cityNotCanadaPricePerBase ??
      globalCanadaPricePerBase ??
      globalNotCanadaPricePerBase ??
      0;

    if (pricePerBase > 0) {
      return pricePerBase * quantity;
    }

    return (
      cityCanadaAveragePrice ??
      cityNotCanadaAveragePrice ??
      globalCanadaAverage ??
      globalNotCanadaAverage ??
      0
    );
  }

  if (canadian === true) {
    const pricePerBase =
      cityCanadaPricePerBase ??
      globalCanadaPricePerBase ??
      (defaultToGlobal
        ? cityNotCanadaPricePerBase ?? globalNotCanadaPricePerBase
        : null) ??
      0;

    if (pricePerBase > 0) {
      return pricePerBase * quantity;
    }

    return (
      cityCanadaAveragePrice ??
      globalCanadaAverage ??
      (defaultToGlobal
        ? cityNotCanadaAveragePrice ?? globalNotCanadaAverage
        : null) ??
      0
    );
  }

  // canadian === false
  const pricePerBase =
    cityNotCanadaPricePerBase ??
    globalNotCanadaPricePerBase ??
    (defaultToGlobal
      ? cityCanadaPricePerBase ?? globalCanadaPricePerBase
      : null) ??
    0;

  if (pricePerBase > 0) {
    return pricePerBase * quantity;
  }

  return (
    cityNotCanadaAveragePrice ??
    globalNotCanadaAverage ??
    (defaultToGlobal ? cityCanadaAveragePrice ?? globalCanadaAverage : null) ??
    0
  );
};

export default calculateFinalPrice;
