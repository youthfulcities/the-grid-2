import awsExports from '@/aws-exports';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;
    const API_URL = awsExports.aws_cloud_logic_custom.find(
      (item) => item.name === 'chatbot'
    )?.endpoint;

    const lambdaResponse = await axios.post(`${API_URL}/query`, { query });
    console.log(lambdaResponse.data);
    return NextResponse.json(lambdaResponse.data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch from Bedrock' },
      { status: 500 }
    );
  }
}
