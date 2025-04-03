'use client';

import Container from '@/app/components/Background';
import FadeInUp from '@/app/components/FadeInUp';
import { View } from '@aws-amplify/ui-react';
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

  useEffect(() => {
    const fetchGroceryItems = async () => {
      try {
        const response = await fetch('/api/grocery');
        const data = await response.json();
        setGroceryItems(data);
      } catch (error) {
        console.error('Error fetching grocery items:', error);
      }
    };

    fetchGroceryItems();
  }, []);

  return (
    <Container>
      <View className='container padding'>
        <h1>Grocery Items</h1>
        <ul>
          {groceryItems.map((item, index) => (
            <FadeInUp key={index}>
              <li>
                <h2>{item.product_name}</h2>
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
