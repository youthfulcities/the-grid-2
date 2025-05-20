export interface IncomeEntry {
  Age_12_Group: string;
  Gender_Label: string;
  NOC_Class: string;
  'Province Name': string;
  avg_hrlyearn: number;
  avg_hrlyearn_post_tax: number;
  avg_monthly_income: number;
  avg_monthly_income_post_tax: number;
  median_hrlyearn: number;
  median_hrlyearn_post_tax: number;
  median_monthly_income: number;
  median_monthly_income_post_tax: number;
  sample_size: number;
}

export interface IncomeItem {
  city: string;
  province: string;
  avg_monthly_income: number;
  avg_monthly_income_post_tax: number;
  median_monthly_income: number;
  median_monthly_income_post_tax: number;
  weighted_avg_monthly_income: number;
  weighted_avg_monthly_income_post_tax: number;
  data: [IncomeEntry];
}

export type IncomeData = IncomeItem[];
