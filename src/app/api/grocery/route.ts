import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl =
    'https://v03ckta50h.execute-api.ca-central-1.amazonaws.com/staging/items';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
