'use client';

import Container from '@/app/components/Background';
import FadeInUp from '@/app/components/FadeInUp';
import { Text, View } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';

interface GroceryItem {
  category: string;
  category_average: number | null;
  category_canada_average: number | null;
  category_not_canada_average: number | null;
  cities: {
    city: string;
    prepared_in_canada: number | null;
    not_prepared_in_canada: number | null;
    city_average: number | null;
  }[];
}
const GroceryList: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroceryItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/grocery/public/unique');
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load grocery items');
        }

        setGroceryItems(result);
        setErrorText(null);
      } catch (error: any) {
        console.error('Error fetching grocery items:', error);
        setErrorText(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryItems();
  }, []);

  return (
    <Container>
      <View className='container padding'>
        <h1>Grocery Category Averages</h1>

        {loading && <Text>Loading...</Text>}

        {errorText && !loading && (
          <Text className='text-red-600 font-semibold'>{errorText}</Text>
        )}

        {!loading && groceryItems && groceryItems.length > 0 && (
          <ul>
            {groceryItems.map((group, index) => (
              <FadeInUp key={group.category}>
                <li className='mb-8'>
                  <h2 className='text-xl font-bold mb-1'>{group.category}</h2>
                  <p className='text-sm text-gray-600 mb-2'>
                    Category Average: ${group.category_average?.toFixed(2)}
                  </p>
                  <p className='text-sm text-gray-600 mb-2'>
                    Canadian Average: $
                    {group.category_canada_average?.toFixed(2) ?? 'N/A'}
                  </p>
                  <p className='text-sm text-gray-600 mb-2'>
                    Non-Canadian Average: $
                    {group.category_not_canada_average?.toFixed(2) ?? 'N/A'}
                  </p>
                  <ul className='ml-4 space-y-2'>
                    {/* {group.cities.map((cityData, cityIndex) => (
                      <li key={cityIndex} className='border p-2 rounded-md'>
                        <p className='font-semibold text-md mb-1'>
                          {cityData.city}
                        </p>

                        <div className='text-sm'>
                          <p>
                            Prepared in Canada:{' '}
                            {cityData.prepared_in_canada !== null
                              ? `$${cityData.prepared_in_canada.toFixed(2)}`
                              : 'N/A'}
                          </p>
                          <p>
                            Not Prepared in Canada:{' '}
                            {cityData.not_prepared_in_canada !== null
                              ? `$${cityData.not_prepared_in_canada.toFixed(2)}`
                              : 'N/A'}
                          </p>
                          <p className='font-medium'>
                            City Average: ${cityData.city_average.toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))} */}
                  </ul>
                </li>
              </FadeInUp>
            ))}
          </ul>
        )}

        {!loading && groceryItems?.length === 0 && !errorText && (
          <Text>No data available.</Text>
        )}
      </View>
    </Container>
  );
};

export default GroceryList;
