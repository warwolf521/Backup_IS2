import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const session = await getToken({ req });
  return NextResponse.json(session?.sub);
}