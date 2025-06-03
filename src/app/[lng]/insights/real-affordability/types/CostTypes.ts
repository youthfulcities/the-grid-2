export interface CityCostMap {
  [city: string]: number;
}

export interface ItemCityDetail {
  price_2025: number;
  normalized_price: number;
  normalized_monthly_cost: number;
}

export interface IndicatorItem {
  monthly_quantity_2022: number;
  national_average_monthly_cost: number;
  cities: Record<string, ItemCityDetail>;
}

export interface IndicatorDetail {
  total_monthly_cost_national: number;
  total_monthly_cost_by_city: CityCostMap;
  items: Record<string, IndicatorItem>;
}

export interface CategoryData {
  category: string;
  total_monthly_cost_national: number;
  total_monthly_cost_by_city: CityCostMap;
  indicators: Record<string, IndicatorDetail>;
}
