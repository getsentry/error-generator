import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const delay = parseInt(searchParams.get('delay') || '50', 10);
    const id = searchParams.get('id') || '0';

    const clampedDelay = Math.min(Math.max(delay, 0), 5000);
    await new Promise((resolve) => setTimeout(resolve, clampedDelay));

    return NextResponse.json({
        id,
        timestamp: Date.now(),
        delay: clampedDelay,
    });
}
