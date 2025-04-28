import config from '@/amplifyconfiguration.json';
import awsExports from '@/aws-exports';
import { Amplify } from 'aws-amplify';
import { downloadData, uploadData } from 'aws-amplify/storage';
import _ from 'lodash';
import { NextResponse } from 'next/server';

export const API_URL = awsExports.aws_cloud_logic_custom.find(
  (item) => item.name === 'grocery'
)?.endpoint;

Amplify.configure(config);

interface GroceryItem {
  city: string;
  category: string;
  average_price: number;
  average_price_per_base: number;
  average_quantity: number;
  most_frequent_quantity: number;
  quantity_unit: string;
  average_base_amount: number;
  base_unit: string;
  prepared: boolean;
  normalized_price?: number;
  latest_timestamp?: string | null;
  statscan_unit?: string | null;
  statscan_quantity?: number | null;
}

interface GroceryItemResponse {
  prepared_in_canada: GroceryItem[];
  not_prepared_in_canada: GroceryItem[];
}

interface CityGroupedItem {
  latest_timestamp: string | null;
  city: string;
  statscan_unit?: string | null;
  statscan_quantity?: number | null;
  canada_average_price: number | null;
  not_canada_average_price: number | null;
  canada_normalized_average: number | null;
  not_canada_normalized_average: number | null;
  quantity_unit: string | null;
  base_amount: number | null;
  base_unit: string | null;
}

interface CategoryGroupedItem {
  latest_timestamp: string | null;
  category: string;
  canada_average_price: number | null;
  not_canada_average_price: number | null;
  canada_average_price_per_base: number | null;
  not_canada_average_price_per_base: number | null;
  canada_normalized_average: number | null;
  not_canada_normalized_average: number | null;
  most_frequent_quantity: number | null;
  category_average: number | null;
  category_normalized_average: number | null;
  average_base_amount: number | null;
  base_unit: string | null;
  average_quanitity?: number | null;
  cities: CityGroupedItem[];
}

export const dynamic = 'force-dynamic';

const CACHE_KEY = 'public/cache/grocery-public-unique.json';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const getCachedJson = async () => {
  try {
    const { body } = await downloadData({
      path: CACHE_KEY,
    }).result;

    const text = await body.text();
    const parsed = JSON.parse(text);

    const cachedAt = new Date(parsed.cachedAt || 0);
    const ageMs = Date.now() - cachedAt.getTime();

    if (ageMs < CACHE_TTL_MS) {
      console.log('✅ Using cached JSON from S3');
      return parsed.data;
    }

    console.log('⏳ Cache is too old, reprocessing...');
    return null;
  } catch (err) {
    console.log('📂 No cached file found or failed to read:', err);
    return null;
  }
};

const cacheJsonToS3 = async (data: any) => {
  try {
    const blob = new Blob(
      [JSON.stringify({ cachedAt: new Date().toISOString(), data })],
      { type: 'application/json' }
    );

    await uploadData({
      path: CACHE_KEY,
      data: blob,
      options: {
        contentType: 'application/json',
        metadata: {
          source: 'api-cache',
        },
      },
    }).result;

    console.log('✅ JSON cached to S3 successfully');
  } catch (err) {
    console.error('❌ Failed to cache JSON to S3:', err);
  }
};

const mode = (values: number[]): number | null => {
  const frequency: Record<number, number> = {};
  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
  });

  let mostFrequent: number | null = null;

  Object.entries(frequency).reduce(
    (acc, [val, count]) => {
      const num = parseFloat(val);
      if (count > acc.maxCount) {
        mostFrequent = num;
        acc.maxCount = count;
      }
      return acc;
    },
    { maxCount: 0 }
  );

  return mostFrequent;
};

const avg = (values: number[]) =>
  values.length > 0
    ? parseFloat(
        (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(5)
      )
    : null;

const getTransformedData = async (): Promise<CategoryGroupedItem[]> => {
  const response = await fetch(`${API_URL}/public/unique`);

  if (!response.ok) {
    throw new Error('Failed to fetch source data');
  }

  const rawData: GroceryItemResponse = await response.json();

  const allItems = [
    ...rawData.prepared_in_canada.map((item) => ({
      ...item,
      prepared: true,
    })),
    ...rawData.not_prepared_in_canada.map((item) => ({
      ...item,
      prepared: false,
    })),
  ];

  const categoryGrouped = _.groupBy(allItems, 'category');

  const categoryToMostFrequentQty: Record<string, number | null> = {};
  const categoryToBaseUnit: Record<string, string | null> = {};

  Object.entries(categoryGrouped).forEach(([category, items]) => {
    const typedItems = items as GroceryItem[]; // Explicitly type items

    // Get the dominant base unit for this category
    const baseUnitFrequency: Record<string, number> = {};
    typedItems.forEach((item) => {
      const unit = item.base_unit?.toLowerCase();
      if (unit) {
        baseUnitFrequency[unit] = (baseUnitFrequency[unit] || 0) + 1;
      }
    });

    let dominantBaseUnit: string | null = null;
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
      .map((item) => item.most_frequent_quantity as number);

    categoryToMostFrequentQty[category] = mode(matchingQuantities);
    categoryToBaseUnit[category] = dominantBaseUnit;
  });

  console.log(allItems.filter((item) => item.category === 'chicken thigh'));

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

  const byCategory = _.groupBy(allItemsWithNormalized, 'category');

  const transformed: CategoryGroupedItem[] = Object.entries(byCategory).map(
    ([category, items]) => {
      const byCity = _.groupBy(items, 'city');

      const cities: CityGroupedItem[] = Object.entries(byCity).map(
        ([city, cityItems]) => {
          const canadaItems = cityItems.filter((i) => i.prepared);
          const notCanadaItems = cityItems.filter((i) => !i.prepared);

          const price_canada = avg(
            canadaItems
              .map((i) => i.average_price)
              .filter((price): price is number => price !== null)
          );
          const price_not_canada = avg(
            notCanadaItems
              .map((i) => i.average_price)
              .filter((price): price is number => price !== null)
          );

          const normalized_canada = avg(
            canadaItems
              .filter((i) => typeof i.normalized_price === 'number')
              .map((i) => i.normalized_price)
              .filter((price): price is number => price !== null)
          );
          const normalized_not_canada = avg(
            notCanadaItems
              .filter((i) => typeof i.normalized_price === 'number')
              .map((i) => i.normalized_price ?? null)
              .filter((price): price is number => price !== null)
          );

          const sampleItem = cityItems.find((i) => i.latest_timestamp);

          const canada_average_price_per_base = avg(
            canadaItems
              .filter(
                (i) =>
                  typeof i.average_price_per_base === 'number' &&
                  i.base_unit ===
                    (i.statscan_unit ? i.statscan_unit : i.base_unit)
              )
              .map((i) => i.average_price_per_base ?? null)
          );

          const not_canada_average_price_per_base = avg(
            notCanadaItems
              .filter(
                (i) =>
                  typeof i.average_price_per_base === 'number' &&
                  i.base_unit ===
                    (i.statscan_unit ? i.statscan_unit : i.base_unit)
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
        }
      );

      const canadaAveragePrices = items
        .filter((i) => i.prepared)
        .map((i) => i.average_price);
      const notCanadaAveragePrices = items
        .filter((i) => !i.prepared)
        .map((i) => i.average_price);

      const canadaPricePerBase = items
        .filter(
          (i) =>
            i.prepared &&
            typeof i.average_price_per_base === 'number' &&
            i.base_unit === (i.statscan_unit ? i.statscan_unit : i.base_unit)
        )
        .map((i) => i.average_price_per_base);

      const notCanadaPricePerBase = items
        .filter(
          (i) =>
            !i.prepared &&
            typeof i.average_price_per_base === 'number' &&
            i.base_unit === (i.statscan_unit ? i.statscan_unit : i.base_unit)
        )
        .map((i) => i.average_price_per_base);

      const canadaNormalizedPrices = items
        .filter((i) => i.prepared && typeof i.normalized_price === 'number')
        .map((i) => i.normalized_price!);

      const notCanadaNormalizedPrices = items
        .filter((i) => !i.prepared && typeof i.normalized_price === 'number')
        .map((i) => i.normalized_price!);

      const allCategoryPrices = items.map((i) => i.average_price);
      const allNormalizedPrices = items
        .filter((i) => typeof i.normalized_price === 'number')
        .map((i) => i.normalized_price!);

      const sampleCategoryItem = items.find(
        (i) => i.average_base_amount || i.quantity_unit || i.latest_timestamp
      );

      const avgCategoryBasePrice = avg(
        items.map((i) => i.average_price_per_base)
      );

      const quantityValues = items
        .map((i) => i.average_quantity)
        .filter((v): v is number => typeof v === 'number');

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
    }
  );
  const sorted_transformed = _.sortBy(transformed, 'category');
  return sorted_transformed;
};

export const GET = async () => {
  try {
    const cached = await getCachedJson();
    if (cached) {
      return NextResponse.json(cached, { status: 200 });
    }
    const transformed = await getTransformedData();
    await cacheJsonToS3(transformed);
    return NextResponse.json(transformed, {
      status: 200,
    });
  } catch (error) {
    console.error('Public unique route error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
};
