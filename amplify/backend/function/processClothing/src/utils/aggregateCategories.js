import { avg, mode } from './calc.js';

const aggregateCategories = (allItems) => {
  const categoryGrouped = allItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categoryToMostFrequentQty = {};
  const categoryToBaseUnit = {};

  Object.entries(categoryGrouped).forEach(([category, items]) => {
    const typedItems = items;

    // Get the dominant base unit for this category
    const baseUnitFrequency = {};
    typedItems.forEach((item) => {
      const unit = item.base_unit?.toLowerCase();
      if (unit) {
        baseUnitFrequency[unit] = (baseUnitFrequency[unit] || 0) + 1;
      }
    });

    let dominantBaseUnit = null;
    let maxCount = 0;
    Object.entries(baseUnitFrequency).forEach(([unit, count]) => {
      if (count > maxCount) {
        dominantBaseUnit = unit;
        maxCount = count;
      }
    });

    // Filter quantity values that match the dominant base unit
    const matchingQuantities = typedItems
      .filter(
        (item) =>
          item.base_unit?.toLowerCase() === dominantBaseUnit &&
          typeof item.most_frequent_quantity === 'number'
      )
      .map((item) => item.most_frequent_quantity);

    categoryToMostFrequentQty[category] = mode(matchingQuantities);
    categoryToBaseUnit[category] = dominantBaseUnit;
  });

  const sharedRazorItems = allItems.filter(
    (item) =>
      item.category === "men's razor" || item.category === "women's razor"
  );

  const sharedRazorAverageQuantity = avg(
    sharedRazorItems
      .map((item) => item.average_quantity)
      .filter((v) => typeof v === 'number')
  );

  const sharedRazorMostFrequentQuantity =
    categoryToMostFrequentQty["men's razor"];

  const allItemsWithNormalized = allItems
    .filter((item) => typeof item.average_price_per_base === 'number')
    .map((item) => {
      const {
        statscan_unit,
        statscan_quantity,
        category,
        base_unit,
        average_price_per_base,
        average_quantity,
        average_base_amount,
      } = item;

      const effective_quantity =
        category === "men's razor" || category === "women's razor"
          ? sharedRazorAverageQuantity
          : average_quantity;

      if (base_unit?.toLowerCase() !== categoryToBaseUnit[category]) {
        return {
          ...item,
          normalized_price: null,
          average_quantity: null,
          most_frequent_quantity: null,
        };
      }

      const effective_most_frequent_quantity =
        category === "men's razor" || category === "women's razor"
          ? sharedRazorMostFrequentQuantity
          : categoryToMostFrequentQty[category];

      const normalized_price =
        typeof effective_quantity === 'number' &&
        typeof effective_most_frequent_quantity === 'number' &&
        typeof average_base_amount === 'number' &&
        average_base_amount !== 0
          ? parseFloat(
              (
                (average_price_per_base / average_base_amount) *
                effective_most_frequent_quantity
              ).toFixed(5)
            )
          : null;

      return {
        ...item,
        average_quantity: effective_quantity,
        average_price_per_base,
        most_frequent_quantity: effective_most_frequent_quantity,
        normalized_price,
        statscan_unit,
        statscan_quantity,
      };
    });

  const byCategory = allItemsWithNormalized.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const transformed = Object.entries(byCategory).map(([category, items]) => {
    const byCity = items.reduce((acc, item) => {
      (acc[item.city] = acc[item.city] || []).push(item);
      return acc;
    }, {});

    const cities = Object.entries(byCity).map(([city, cityItems]) => {
      const canadaItems = cityItems.filter((i) => i.prepared_in_canada);
      const notCanadaItems = cityItems.filter((i) => !i.prepared_in_canada);

      const price_canada = avg(
        canadaItems
          .map((i) => i.average_price)
          .filter((price) => price !== null)
      );
      const price_not_canada = avg(
        notCanadaItems
          .map((i) => i.average_price)
          .filter((price) => price !== null)
      );

      const normalized_canada = avg(
        canadaItems
          .filter((i) => typeof i.normalized_price === 'number')
          .map((i) => i.normalized_price)
          .filter((price) => price !== null)
      );
      const normalized_not_canada = avg(
        notCanadaItems
          .filter((i) => typeof i.normalized_price === 'number')
          .map((i) => i.normalized_price ?? null)
          .filter((price) => price !== null)
      );

      const sampleItem = cityItems.find((i) => i.latest_timestamp);

      const canada_average_price_per_base = avg(
        canadaItems
          .filter(
            (i) =>
              typeof i.average_price_per_base === 'number' &&
              i.base_unit === (i.statscan_unit ? i.statscan_unit : i.base_unit)
          )
          .map((i) => i.average_price_per_base ?? null)
      );

      const not_canada_average_price_per_base = avg(
        notCanadaItems
          .filter(
            (i) =>
              typeof i.average_price_per_base === 'number' &&
              i.base_unit === (i.statscan_unit ? i.statscan_unit : i.base_unit)
          )
          .map((i) => i.average_price_per_base ?? null)
      );

      return {
        city,
        category,
        canada_average_price_per_base,
        statscan_unit: sampleItem?.statscan_unit || null,
        statscan_quantity: sampleItem?.statscan_quantity || null,
        not_canada_average_price_per_base,
        latest_timestamp: sampleItem?.latest_timestamp || null,
        canada_average_price: price_canada,
        not_canada_average_price: price_not_canada,
        canada_normalized_average: normalized_canada,
        not_canada_normalized_average: normalized_not_canada,
        base_unit: sampleItem?.base_unit || null,
        quantity_unit: sampleItem?.quantity_unit || null,
        base_amount: categoryToMostFrequentQty[category],
      };
    });

    const canadaAveragePrices = items
      .filter((i) => i.prepared_in_canada)
      .map((i) => i.average_price);
    const notCanadaAveragePrices = items
      .filter((i) => !i.prepared_in_canada)
      .map((i) => i.average_price);

    const canadaPricePerBase = items
      .filter(
        (i) =>
          i.prepared_in_canada &&
          typeof i.average_price_per_base === 'number' &&
          i.base_unit === (i.statscan_unit ? i.statscan_unit : i.base_unit)
      )
      .map((i) => i.average_price_per_base);

    const notCanadaPricePerBase = items
      .filter(
        (i) =>
          !i.prepared_in_canada &&
          typeof i.average_price_per_base === 'number' &&
          i.base_unit === (i.statscan_unit ? i.statscan_unit : i.base_unit)
      )
      .map((i) => i.average_price_per_base);

    const canadaNormalizedPrices = items
      .filter(
        (i) => i.prepared_in_canada && typeof i.normalized_price === 'number'
      )
      .map((i) => i.normalized_price);

    const notCanadaNormalizedPrices = items
      .filter(
        (i) => !i.prepared_in_canada && typeof i.normalized_price === 'number'
      )
      .map((i) => i.normalized_price);

    const allCategoryPrices = items.map((i) => i.average_price);
    const allNormalizedPrices = items
      .filter((i) => typeof i.normalized_price === 'number')
      .map((i) => i.normalized_price);

    const sampleCategoryItem = items.find(
      (i) => i.average_base_amount || i.quantity_unit || i.latest_timestamp
    );

    const avgCategoryBasePrice = avg(
      items.map((i) => i.average_price_per_base)
    );

    const quantityValues = items
      .map((i) => i.average_quantity)
      .filter((v) => typeof v === 'number');

    const average_quanitity =
      category === "men's razor" || category === "women's razor"
        ? sharedRazorAverageQuantity
        : avg(quantityValues);

    const most_frequent_quantity =
      category === "men's razor" || category === "women's razor"
        ? sharedRazorMostFrequentQuantity
        : categoryToMostFrequentQty[category];

    return {
      category,
      latest_timestamp: sampleCategoryItem?.latest_timestamp || null,
      average_quanitity,
      most_frequent_quantity,
      statscan_unit: sampleCategoryItem?.statscan_unit || null,
      statscan_quantity: sampleCategoryItem?.statscan_quantity || null,
      canada_average_price: avg(canadaAveragePrices),
      not_canada_average_price: avg(notCanadaAveragePrices),
      canada_average_price_per_base: avg(canadaPricePerBase),
      not_canada_average_price_per_base: avg(notCanadaPricePerBase),
      canada_normalized_average: avg(canadaNormalizedPrices),
      not_canada_normalized_average: avg(notCanadaNormalizedPrices),
      category_average: avg(allCategoryPrices),
      category_normalized_average: avg(allNormalizedPrices),
      average_price_per_base: avgCategoryBasePrice,
      average_base_amount: sampleCategoryItem?.average_base_amount || null,
      base_unit: sampleCategoryItem?.base_unit || null,
      cities,
    };
  });

  const sorted_transformed = transformed.sort((a, b) =>
    a.category.localeCompare(b.category)
  );
  return sorted_transformed;
};

export default aggregateCategories;
