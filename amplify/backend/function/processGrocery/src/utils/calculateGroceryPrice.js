const calculateGroceryPrice = (
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
    canada_average_price_per_base,
    not_canada_average_price_per_base,
    canada_average_price,
    not_canada_average_price,
  } = item || {};

  const quantity = statscan_quantity ?? most_frequent_quantity ?? 1;

  if (canadian === null) {
    if (!cityCanadaPricePerBase && cityCanadaAveragePrice) {
      return cityCanadaAveragePrice;
    }

    if (
      !cityCanadaPricePerBase &&
      !cityNotCanadaPricePerBase &&
      cityNotCanadaAveragePrice
    ) {
      return cityNotCanadaAveragePrice;
    }

    const pricePerBase =
      cityCanadaPricePerBase ??
      cityNotCanadaPricePerBase ??
      canada_average_price_per_base ??
      not_canada_average_price_per_base ??
      0;

    if (pricePerBase > 0) return pricePerBase * quantity;

    return (
      cityCanadaAveragePrice ??
      cityNotCanadaAveragePrice ??
      canada_average_price ??
      not_canada_average_price ??
      0
    );
  }

  if (canadian === true) {
    if (!cityCanadaPricePerBase && cityCanadaAveragePrice) {
      return cityCanadaAveragePrice;
    }

    if (
      !canada_average_price_per_base &&
      canada_average_price &&
      defaultToGlobal
    ) {
      return canada_average_price;
    }

    const pricePerBase =
      cityCanadaPricePerBase ??
      (defaultToGlobal
        ? canada_average_price_per_base ??
          // cityNotCanadaPricePerBase ??
          // not_canada_average_price_per_base ??
          0
        : undefined) ??
      0;

    if (pricePerBase > 0) return pricePerBase * quantity;

    return (
      cityCanadaAveragePrice ??
      (defaultToGlobal
        ? canada_average_price ??
          // cityNotCanadaAveragePrice ??
          // not_canada_average_price ??
          0
        : undefined) ??
      0
    );
  }

  if (canadian === false) {
    if (!cityNotCanadaPricePerBase && cityNotCanadaAveragePrice) {
      return cityNotCanadaAveragePrice;
    }

    if (
      !not_canada_average_price_per_base &&
      not_canada_average_price &&
      defaultToGlobal
    ) {
      return not_canada_average_price;
    }

    const pricePerBase =
      cityNotCanadaPricePerBase ??
      (defaultToGlobal
        ? not_canada_average_price_per_base ??
          // cityCanadaPricePerBase ??
          // canada_average_price_per_base ??
          0
        : undefined) ??
      0;

    if (pricePerBase > 0) return pricePerBase * quantity;

    return (
      cityNotCanadaAveragePrice ??
      (defaultToGlobal
        ? not_canada_average_price ??
          // cityCanadaAveragePrice ??
          // canada_average_price ??
          0
        : undefined) ??
      0
    );
  }
  return 0;
};
export default calculateGroceryPrice;
