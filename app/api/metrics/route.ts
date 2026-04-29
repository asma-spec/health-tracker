import { register, collectDefaultMetrics } from 'prom-client';
import { NextResponse } from 'next/server';

collectDefaultMetrics();

export async function GET() {
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    headers: { 'Content-Type': register.contentType },
  });
}
