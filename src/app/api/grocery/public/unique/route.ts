import _ from 'lodash';
import { NextResponse } from 'next/server';

interface GroceryItem {
  city: string;
  category: string;
  average_price: number;
  average_price_per_base: number;
  average_quantity: number;
  quantity_unit: string;
  average_base_amount: number;
  base_unit: string;
  prepared: boolean;
  normalized_price?: number;
  latest_timestamp?: string | null;
}

interface GroceryItemResponse {
  prepared_in_canada: GroceryItem[];
  not_prepared_in_canada: GroceryItem[];
}

interface CityGroupedItem {
  latest_timestamp: string | null;
  city: string;
  canada_average_price: number | null;
  not_canada_average_price: number | null;
  canada_normalized_average: number | null;
  not_canada_normalized_average: number | null;
  quantity_unit: string | null;
  average_base_amount: number | null;
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
  category_average: number | null;
  category_normalized_average: number | null;
  average_base_amount: number | null;
  base_unit: string | null;
  average_quanitity?: number | null;
  cities: CityGroupedItem[];
}

export const dynamic = 'force-dynamic';

const avg = (values: number[]) =>
  values.length > 0
    ? parseFloat(
        (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(5)
      )
    : null;

export async function GET() {
  try {
    const response = await fetch(
      'https://v03ckta50h.execute-api.ca-central-1.amazonaws.com/staging/public/unique'
    );

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { error: err?.error || 'Failed to fetch public data' },
        { status: response.status }
      );
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

    console.log(allItems.filter((item) => item.category === 'cucumber'));

    const sharedRazorItems = allItems.filter(
      (item) =>
        item.category === "men's razor" || item.category === "women's razor"
    );

    const sharedRazorAverageQuantity = avg(
      sharedRazorItems
        .map((item) => item.average_quantity)
        .filter((v) => typeof v === 'number')
    );

    const allItemsWithNormalized = allItems
      .filter((item) => typeof item.average_price_per_base === 'number')
      .map((item) => {
        const {
          average_price_per_base,
          average_quantity,
          average_base_amount,
          category,
        } = item;

        const effective_quantity =
          category === "men's razor" || category === "women's razor"
            ? sharedRazorAverageQuantity
            : average_quantity;

        const normalized_price =
          typeof effective_quantity === 'number' &&
          typeof average_base_amount === 'number' &&
          average_base_amount !== 0
            ? parseFloat(
                (
                  (average_price_per_base / average_base_amount) *
                  effective_quantity
                ).toFixed(5)
              )
            : null;

        return {
          ...item,
          average_quantity: effective_quantity,
          normalized_price,
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
              notCanadaItems.map((i) => i.average_price)
            );

            const normalized_canada = avg(
              canadaItems
                .filter((i) => typeof i.normalized_price === 'number')
                .map((i) => i.normalized_price!)
            );
            const normalized_not_canada = avg(
              notCanadaItems
                .filter((i) => typeof i.normalized_price === 'number')
                .map((i) => i.normalized_price!)
            );

            const sampleItem = cityItems.find(
              (i) =>
                i.average_base_amount || i.quantity_unit || i.latest_timestamp
            );

            return {
              city,
              latest_timestamp: sampleItem?.latest_timestamp || null,
              canada_average_price: price_canada,
              not_canada_average_price: price_not_canada,
              canada_normalized_average: normalized_canada,
              not_canada_normalized_average: normalized_not_canada,
              average_base_amount: sampleItem?.average_base_amount || null,
              base_unit: sampleItem?.base_unit || null,
              quantity_unit: sampleItem?.quantity_unit || null,
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
            (i) => i.prepared && typeof i.average_price_per_base === 'number'
          )
          .map((i) => i.average_price_per_base);

        const notCanadaPricePerBase = items
          .filter(
            (i) => !i.prepared && typeof i.average_price_per_base === 'number'
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

        const average_quanitity =
          category === "men's razor" || category === "women's razor"
            ? sharedRazorAverageQuantity
            : avg(items.map((i) => i.average_quantity as number));

        return {
          category,
          latest_timestamp: sampleCategoryItem?.latest_timestamp || null,
          average_quanitity,
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
}
