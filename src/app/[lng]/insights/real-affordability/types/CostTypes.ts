export interface CityCostMap {
  [city: string]: number;
}

export interface ItemCityDetail {
  price_2025: number;
  normalized_price: number;
  normalized_monthly_cost: number;
}

export type ProfileDetail = {
  monthly_cost_national: number;
  monthly_cost_by_city: CityCostMap;
};

export type Profiles = {
  [Profile in string]: ProfileDetail;
};

export interface IndicatorItemDetail {
  total: ProfileDetail;
  profiles: Profiles;
  cities: Record<string, unknown>;
  item_profiles: Record<
    string,
    {
      monthly_quantity_2022: number;
      description: string;
      cities: Record<string, ItemCityDetail>;
    }
  >;
}

export interface IndicatorDetail {
  total: ProfileDetail;
  profiles: Profiles;
  items: Record<string, IndicatorItemDetail>;
}

export interface CategoryData {
  category: string;
  indicators: Record<string, IndicatorDetail>;
  profiles: Profiles;
  total: ProfileDetail;
}
