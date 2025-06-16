import React from 'react';

export interface CityEntry {
  city: string;
  base_unit: string | null;
  canada_average_price_per_base: number | null;
  not_canada_average_price_per_base: number | null;
  quantity_unit?: number | null;
  latest_timestamp?: string | null;
  canada_average_price: number | null;
  canada_normalized_average: number | null;
  not_canada_average_price: number | null;
  not_canada_normalized_average: number | null;
  average_base_amount: number | null;
}

export interface GroceryItem {
  statscan_quantity?: number | null;
  statscan_unit?: string | null;
  category: string;
  latest_timestamp?: string | null;
  average_quantity: number | null;
  canada_average_price: number | null;
  not_canada_average_price: number | null;
  canada_average_price_per_base: number | null;
  not_canada_average_price_per_base: number | null;
  canada_normalized_average: number | null;
  not_canada_normalized_average: number | null;
  most_frequent_quantity: number | null;
  category_average: number | null;
  category_normalized_average: number | null;
  average_price_per_base: number | null;
  average_base_amount: number | null;
  base_unit: string | null;
  cities: CityEntry[];
}
export interface BasketEntry {
  item: GroceryItem;
  quantity: number;
}

export interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string | React.ReactNode;
  group?: string;
  cluster?: string;
  child?: React.ReactNode | null;
  minWidth?: number;
}
