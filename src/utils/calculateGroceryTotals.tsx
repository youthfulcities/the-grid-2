// lib/cityTotals.ts
import {
  BasketEntry,
  GroceryItem,
} from '@/app/[lng]/insights/real-affordability/types';

export const calculateGroceryPrice = (
  item: any,
  city: any,
  canadian: boolean | null = null,
  defaultToGlobal: boolean = false
): number => {
  const {
    canada_average_price: city_canada_average_price,
    not_canada_average_price: city_not_canada_average_price,
    canada_average_price_per_base: city_canada_price_per_base,
    not_canada_average_price_per_base: city_not_canada_price_per_base,
  } = city || {};

  const {
    statscan_quantity,
    most_frequent_quantity,
    canada_average_price_per_base,
    not_canada_average_price_per_base,
    canada_average_price,
    not_canada_average_price,
  } = item;

  const quantity = statscan_quantity ?? most_frequent_quantity ?? 1;

  if (canadian === null) {
    const pricePerBase =
      city_canada_price_per_base ??
      city_not_canada_price_per_base ??
      canada_average_price_per_base ??
      not_canada_average_price_per_base ??
      0;

    if (pricePerBase > 0) return pricePerBase * quantity;

    return (
      city_canada_average_price ??
      city_not_canada_average_price ??
      canada_average_price ??
      not_canada_average_price ??
      0
    );
  }

  if (canadian) {
    const pricePerBase =
      city_canada_price_per_base ??
      canada_average_price_per_base ??
      (defaultToGlobal &&
        (city_not_canada_price_per_base ??
          not_canada_average_price_per_base)) ??
      0;

    if (pricePerBase > 0) return pricePerBase * quantity;

    return (
      city_canada_average_price ??
      canada_average_price ??
      (defaultToGlobal &&
        (city_not_canada_average_price ?? not_canada_average_price)) ??
      0
    );
  }

  const pricePerBase =
    city_not_canada_price_per_base ??
    not_canada_average_price_per_base ??
    (defaultToGlobal &&
      (city_canada_price_per_base ?? canada_average_price_per_base)) ??
    0;

  if (pricePerBase > 0) return pricePerBase * quantity;

  return (
    city_not_canada_average_price ??
    not_canada_average_price ??
    (defaultToGlobal && (city_canada_average_price ?? canada_average_price)) ??
    0
  );
};

export const getCanadianPriceOnly = (item: any, city: any): number => {
  const quantity = item.statscan_quantity ?? item.most_frequent_quantity ?? 1;

  const pricePerBase =
    city?.canada_average_price_per_base ?? item.canada_average_price_per_base;

  if (pricePerBase !== undefined) return pricePerBase * quantity;

  return city?.canada_average_price ?? item.canada_average_price ?? 0;
};

export const getNonCanadianPriceOnly = (item: any, city: any): number => {
  const quantity = item.statscan_quantity ?? item.most_frequent_quantity ?? 1;

  const pricePerBase =
    city?.not_canada_average_price_per_base ??
    item.not_canada_average_price_per_base;

  if (pricePerBase !== undefined) return pricePerBase * quantity;

  return city?.not_canada_average_price ?? item.not_canada_average_price ?? 0;
};

export const calculateGroceryTotals = (
  groceryItems: GroceryItem[],
  basket: Record<string, BasketEntry>,
  canadian: boolean | null = null
) => {
  const cityTotals: Record<string, number> = {};

  const allCities = new Set(
    groceryItems.flatMap((item) => item.cities.map((c) => c.city))
  );

  if (Object.keys(basket).length === 0) {
    allCities.forEach((cityName) => {
      groceryItems.forEach((item) => {
        const cityData = item.cities.find((c) => c.city === cityName);
        let value = 0;
        if (canadian === true) {
          value = getCanadianPriceOnly(item, cityData ?? null);
        } else value = calculateGroceryPrice(item, cityData ?? null);
        cityTotals[cityName] = (cityTotals[cityName] || 0) + value;
      });
    });
  } else {
    allCities.forEach((cityName) => {
      Object.values(basket).forEach(({ item, quantity }) => {
        const cityData = item.cities.find((c) => c.city === cityName);
        let value = 0;
        if (canadian === true) {
          value = getCanadianPriceOnly(item, cityData ?? null);
        } else value = calculateGroceryPrice(item, cityData ?? null);
        cityTotals[cityName] = (cityTotals[cityName] || 0) + value * quantity;
      });
    });
  }

  return Object.entries(cityTotals).map(([city, totalPrice]) => ({
    city,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  }));
};
