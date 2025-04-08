'use client';

import Container from '@/app/components/Background';
import FadeInUp from '@/app/components/FadeInUp';
import authFetch from '@/utils/authFetch';
import { Text, View } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';

interface GroceryItem {
  quantity_unit: string;
  quantity: number;
  product_name: string;
  timestamp: string;
  brand: string;
  postal_code: string;
  city: string;
  base_unit: string;
  base_amount: number;
  price_per_base_amount: number;
  category: string;
  sk: string;
  price: number;
  pk: string;
  prepared_in_canada: string;
}

const GroceryList: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroceryItems = async () => {
      setLoading(true);
      try {
        const response = await authFetch(
          '/api/grocery/unique?prepared_in_canada=true'
        );
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
        <h1>Grocery Items</h1>

        {loading && <Text>Loading...</Text>}

        {errorText && !loading && (
          <Text className='text-red-600 font-semibold'>{errorText}</Text>
        )}

        {!loading && groceryItems.length === 0 && !errorText && (
          <Text>No grocery items found.</Text>
        )}

        <ul>
          {!loading &&
            groceryItems.map((item, index) => (
              <FadeInUp key={index}>
                <li className='mb-6'>
                  <h2 className='text-lg font-bold'>{item.product_name}</h2>
                  <p>Brand: {item.brand}</p>
                  <p>Category: {item.category}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p>
                    Quantity: {item.quantity} {item.quantity_unit}
                  </p>
                  <p>City: {item.city}</p>
                  <p>
                    Prepared in Canada:{' '}
                    {item.prepared_in_canada === 'true' ? 'Yes' : 'No'}
                  </p>
                </li>
              </FadeInUp>
            ))}
        </ul>
      </View>
    </Container>
  );
};

export default GroceryList;
