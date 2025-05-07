import { NextResponse } from 'next/server';
import { fetchCities } from '@/lib/api';
import type { CitySearchParams } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: CitySearchParams = {
      q: searchParams.get('q') || undefined,
      rows: searchParams.get('rows') ? parseInt(searchParams.get('rows')!) : undefined,
      start: searchParams.get('start') ? parseInt(searchParams.get('start')!) : undefined,
      sort: searchParams.get('sort') || undefined
    };

    const result = await fetchCities(params);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Cities API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}