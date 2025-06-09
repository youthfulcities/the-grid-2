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

// Create a generic type that builds the keys dynamically
export type ProfileDetail<ProfileKey extends string> = {
  [K in `total_monthly_cost_national_${ProfileKey}`]: number;
} & {
  [K in `total_monthly_cost_by_city_${ProfileKey}`]: CityCostMap;
};

// Now, Profiles is a mapped type that takes each profile key (as a string) and maps it to its ProfileDetail.
export type Profiles = {
  [Profile in string]: ProfileDetail<Profile>;
};

export interface CategoryData {
  category: string;
  total_monthly_cost_national: number;
  total_monthly_cost_by_city: CityCostMap;
  indicators: Record<string, IndicatorDetail>;
  profiles: Profiles;
}
