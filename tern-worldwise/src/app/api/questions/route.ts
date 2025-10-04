export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const count = await prisma.user.count();
  return NextResponse.json({ ok: true, users: count });
}
