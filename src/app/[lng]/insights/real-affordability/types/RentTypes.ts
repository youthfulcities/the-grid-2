export interface RentItem {
  city: string;
  rent: number;
  bedrooms: {
    0?: number;
    1?: number;
    2?: number;
    3?: number;
  };
}

export type RentData = RentItem[];
