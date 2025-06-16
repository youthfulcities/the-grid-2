// lib/cityTotals.ts
import {
  BasketEntry,
  CityEntry,
  GroceryItem,
} from '@/app/[lng]/insights/real-affordability/types/BasketTypes';

export interface CityTotal {
  city: string;
  totalPrice: number;
  totalCanadianCost: number;
  totalNotCanadianCost: number;
  differenceFromNationalAverage?: number;
}

export const calculateGroceryPrice = (
  item: GroceryItem,
  city?: CityEntry | null,
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
    if (!city_canada_price_per_base && city_canada_average_price) {
      return city_canada_average_price;
    }

    if (
      !city_canada_price_per_base &&
      !city_not_canada_price_per_base &&
      city_not_canada_average_price
    ) {
      return city_not_canada_average_price;
    }

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

  if (canadian === true) {
    if (!city_canada_price_per_base && city_canada_average_price) {
      return city_canada_average_price;
    }

    if (
      !canada_average_price_per_base &&
      canada_average_price &&
      defaultToGlobal
    ) {
      return canada_average_price;
    }

    const pricePerBase =
      city_canada_price_per_base ??
      (defaultToGlobal
        ? canada_average_price_per_base ??
          // city_not_canada_price_per_base ??
          // not_canada_average_price_per_base ??
          0
        : undefined) ??
      0;

    if (pricePerBase > 0) return pricePerBase * quantity;

    return (
      city_canada_average_price ??
      (defaultToGlobal
        ? canada_average_price ??
          // city_not_canada_average_price ??
          // not_canada_average_price ??
          0
        : undefined) ??
      0
    );
  }

  if (canadian === false) {
    if (!city_not_canada_price_per_base && city_not_canada_average_price) {
      return city_not_canada_average_price;
    }

    if (
      !not_canada_average_price_per_base &&
      not_canada_average_price &&
      defaultToGlobal
    ) {
      return not_canada_average_price;
    }

    const pricePerBase =
      city_not_canada_price_per_base ??
      (defaultToGlobal
        ? not_canada_average_price_per_base ??
          // city_canada_price_per_base ??
          // canada_average_price_per_base ??
          0
        : undefined) ??
      0;

    if (pricePerBase > 0) return pricePerBase * quantity;

    return (
      city_not_canada_average_price ??
      (defaultToGlobal
        ? not_canada_average_price ??
          // city_canada_average_price ??
          // canada_average_price ??
          0
        : undefined) ??
      0
    );
  }
  return 0;
};

export const getCanadianPriceOnly = (
  item: GroceryItem,
  city: CityEntry
): number => {
  const quantity = item.statscan_quantity ?? item.most_frequent_quantity ?? 1;

  const pricePerBase =
    city?.canada_average_price_per_base ?? item.canada_average_price_per_base;

  if (pricePerBase !== undefined) return pricePerBase ?? 0 * quantity;

  return city?.canada_average_price ?? item.canada_average_price ?? 0;
};

export const getNonCanadianPriceOnly = (
  item: GroceryItem,
  city: CityEntry
): number => {
  const quantity = item.statscan_quantity ?? item.most_frequent_quantity ?? 1;

  const pricePerBase =
    city?.not_canada_average_price_per_base ??
    item.not_canada_average_price_per_base;

  if (pricePerBase !== undefined) return pricePerBase ?? 0 * quantity;

  return city?.not_canada_average_price ?? item.not_canada_average_price ?? 0;
};

// export const calculateGroceryTotals = (
//   groceryItems: GroceryItem[],
//   basket: Record<string, BasketEntry>,
//   canadian: boolean | null = null
// ) => {
//   const cityTotals: Record<string, number> = {};

//   const allCities = new Set(
//     groceryItems.flatMap((item) => item.cities.map((c) => c.city))
//   );

//   if (Object.keys(basket).length === 0) {
//     allCities.forEach((cityName) => {
//       groceryItems.forEach((item) => {
//         const cityData = item.cities.find((c) => c.city === cityName);
//         let value = 0;
//         if (canadian === true) {
//           value = getCanadianPriceOnly(item, cityData ?? null);
//         } else value = calculateGroceryPrice(item, cityData ?? null);
//         cityTotals[cityName] = (cityTotals[cityName] || 0) + value;
//       });
//     });
//   } else {
//     allCities.forEach((cityName) => {
//       Object.values(basket).forEach(({ item, quantity }) => {
//         const cityData = item.cities.find((c) => c.city === cityName);
//         let value = 0;
//         if (canadian === true) {
//           value = getCanadianPriceOnly(item, cityData ?? null);
//         } else value = calculateGroceryPrice(item, cityData ?? null);
//         cityTotals[cityName] = (cityTotals[cityName] || 0) + value * quantity;
//       });
//     });
//   }

//   return Object.entries(cityTotals).map(([city, totalPrice]) => ({
//     city,
//     totalPrice: parseFloat(totalPrice.toFixed(2)),
//   }));
// };

export const calculateGroceryTotals = (
  groceryItems: GroceryItem[],
  basket: Record<string, BasketEntry>
) => {
  const cityTotals: Record<
    string,
    {
      totalPrice: number;
      totalCanadianCost: number;
      totalNotCanadianCost: number;
      nationalAverage: number;
    }
  > = {};

  // Get all cities across items
  const allCities = new Set(
    groceryItems.flatMap((item) => item.cities.map((c) => c.city))
  );

  if (Object.keys(basket).length === 0) {
    // When basket is empty, count each item once (quantity = 1)
    allCities.forEach((cityName) => {
      groceryItems.forEach((item) => {
        const cityData = item.cities.find((c) => c.city === cityName);
        const national = calculateGroceryPrice(item, null, null);
        const overall = calculateGroceryPrice(item, cityData, null) * 1;
        const canadianCost =
          calculateGroceryPrice(item, cityData, true, false) * 1;
        const nonCanadianCost =
          calculateGroceryPrice(item, cityData, false, false) * 1;
        if (!cityTotals[cityName]) {
          cityTotals[cityName] = {
            totalPrice: 0,
            totalCanadianCost: 0,
            totalNotCanadianCost: 0,
            nationalAverage: 0,
          };
        }
        cityTotals[cityName].totalPrice += overall;

        if (canadianCost > 0) {
          cityTotals[cityName].totalCanadianCost += canadianCost;
        }
        if (canadianCost === 0) {
          cityTotals[cityName].totalNotCanadianCost += nonCanadianCost;
        }
        if (canadianCost > 0 || nonCanadianCost > 0) {
          cityTotals[cityName].nationalAverage += national;
        }
      });
    });
  } else {
    // When basket has items, factor in basket quantities.
    allCities.forEach((cityName) => {
      Object.values(basket).forEach(({ item, quantity }) => {
        const cityData = item.cities.find((c) => c.city === cityName);
        const national = calculateGroceryPrice(item, null, null);
        const overall = calculateGroceryPrice(item, cityData, null) * quantity;
        const canadianCost =
          calculateGroceryPrice(item, cityData, true, false) * quantity;
        const nonCanadianCost =
          calculateGroceryPrice(item, cityData, false, false) * quantity;
        if (!cityTotals[cityName]) {
          cityTotals[cityName] = {
            totalPrice: 0,
            totalCanadianCost: 0,
            totalNotCanadianCost: 0,
            nationalAverage: 0,
          };
        }
        cityTotals[cityName].totalPrice += overall;
        if (canadianCost > 0)
          cityTotals[cityName].totalCanadianCost += canadianCost;
        if (canadianCost === 0) {
          cityTotals[cityName].totalNotCanadianCost += nonCanadianCost;
        }
        if (canadianCost > 0 || nonCanadianCost > 0) {
          cityTotals[cityName].nationalAverage += national;
        }
      });
    });
  }

  // Convert the totals object into an array of CityTotal objects.
  const totalsArray = Object.entries(cityTotals).map(([city, totals]) => {
    const cityBasket = totals.totalCanadianCost + totals.totalNotCanadianCost;
    const differenceFactor =
      totals.nationalAverage !== 0 ? cityBasket / totals.nationalAverage : 0;
    const nationalComponent = totals.totalPrice - cityBasket;
    const newTotal = cityBasket + nationalComponent * differenceFactor;

    return {
      city,
      totalPrice: newTotal > 0 ? newTotal : totals.totalPrice,
      totalCanadianCost: totals.totalCanadianCost,
      totalNotCanadianCost: totals.totalNotCanadianCost,
      differenceFromNationalAverage: differenceFactor,
      nationalComparison: totals.nationalAverage,
    };
  });
  return totalsArray;
};
