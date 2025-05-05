import awsExports from '@/aws-exports';
import { calculateGroceryTotals } from '@/utils/calculateGroceryTotals';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const GET = async () => {
  const API_URL = awsExports.aws_cloud_logic_custom.find(
    (item) => item.name === 'grocery'
  )?.endpoint;

  try {
    const response = await fetch(`${API_URL}/public/all`);
    const groceryItems = await response.json();
    if (!Array.isArray(groceryItems)) {
      throw new Error('Invalid grocery data');
    }

    const totals = calculateGroceryTotals(groceryItems, {}); // empty basket
    return NextResponse.json(totals);
  } catch (err: any) {
    console.error('City Totals Error:', err);
    return NextResponse.json(
      { error: 'Failed to calculate city totals' },
      { status: 500 }
    );
  }
};
