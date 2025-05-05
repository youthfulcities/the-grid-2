import awsExports from '@/aws-exports';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const API_URL = awsExports.aws_cloud_logic_custom.find(
  (item) => item.name === 'grocery'
)?.endpoint;

export const GET = async () => {
  try {
    const response = await fetch(`${API_URL}/public/income`);
    const body = await response.json();
    return NextResponse.json(body, {
      status: response.status,
    });
  } catch (error) {
    console.error('Public/all route error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
};
