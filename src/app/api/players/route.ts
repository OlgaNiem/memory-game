import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
 
 const body = await request.json()
 console.log(body)

  const players = await sql`SELECT * FROM Players;`;
  return NextResponse.json({ players }, { status: 200 });
}