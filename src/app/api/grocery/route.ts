import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const apiUrl =
    'https://v03ckta50h.execute-api.ca-central-1.amazonaws.com/staging/items/';

  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return NextResponse.json(
        {
          error: 'You do not have permission to view this page. Please log in.',
        },
        { status: 401 }
      );
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to fetch data' },
        { status: response.status }
      );
    }
    console.log('Data fetched successfully:', data.length);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    let message = 'An unexpected error occurred';
    let status = 500;

    if (error instanceof Error) {
      message = error.message;
      if ('status' in error && typeof error.status === 'number') {
        status = error.status;
      }
    }

    console.error('Error fetching data:', error);
    return NextResponse.json({ error: message }, { status });
  }
}

export const dynamic = 'force-dynamic';
