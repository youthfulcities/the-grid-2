import _ from 'lodash';
import { NextResponse } from 'next/server';

interface AverageItem {
  city: string;
  category: string;
  average_price: number;
}

interface GroceryItemResponse {
  prepared_in_canada: AverageItem[];
  not_prepared_in_canada: AverageItem[];
}

interface CategoryGroupedItem {
  category: string;
  category_average: number | null;
  cities: {
    city: string;
    prepared_in_canada: number | null;
    not_prepared_in_canada: number | null;
    city_average: number | null;
  }[];
}

// export const dynamic = 'force-dynamic';

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
    console.log('Data fetched successfully');

    // Combine and flag data
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

    // Group by category
    const byCategory = _.groupBy(allItems, 'category');

    const transformed: CategoryGroupedItem[] = Object.entries(byCategory).map(
      ([category, items]) => {
        const byCity = _.groupBy(items, 'city');

        const cities = Object.entries(byCity).map(([city, cityItems]) => {
          const preparedItem = cityItems.find((i) => i.prepared === true);
          const notPreparedItem = cityItems.find((i) => i.prepared === false);

          const prepared = preparedItem?.average_price ?? null;
          const notPrepared = notPreparedItem?.average_price ?? null;

          const allPrices = cityItems.map((i) => i.average_price);
          const cityAverage =
            allPrices.length > 0
              ? parseFloat(
                  (
                    allPrices.reduce((sum, val) => sum + val, 0) /
                    allPrices.length
                  ).toFixed(2)
                )
              : null;

          return {
            city,
            prepared_in_canada: prepared,
            not_prepared_in_canada: notPrepared,
            city_average: cityAverage,
          };
        });

        const allCategoryPrices = items.map((i) => i.average_price);

        const categoryCanadaPrices = items
          .filter((i) => i.prepared)
          .map((i) => i.average_price);
        const categoryNotCanadaPrices = items
          .filter((i) => !i.prepared)
          .map((i) => i.average_price);

        const category_average =
          allCategoryPrices.length > 0
            ? parseFloat(
                (
                  allCategoryPrices.reduce((sum, val) => sum + val, 0) /
                  allCategoryPrices.length
                ).toFixed(2)
              )
            : null;

        const category_canada_average =
          categoryCanadaPrices.length > 0
            ? parseFloat(
                (
                  categoryCanadaPrices.reduce((sum, val) => sum + val, 0) /
                  categoryCanadaPrices.length
                ).toFixed(2)
              )
            : null;

        const category_not_canada_average =
          categoryNotCanadaPrices.length > 0
            ? parseFloat(
                (
                  categoryNotCanadaPrices.reduce((sum, val) => sum + val, 0) /
                  categoryNotCanadaPrices.length
                ).toFixed(2)
              )
            : null;

        return {
          category,
          category_average,
          category_canada_average,
          category_not_canada_average,
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
