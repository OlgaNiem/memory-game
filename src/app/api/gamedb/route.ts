import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // get req
    const { level, score } = await request.json();

    // check data
    if (level === undefined || score === undefined) {
      return NextResponse.json({ error: 'Missing level or score' }, { status: 400 });
    }

    // insert data to db
    await sql`
      INSERT INTO Gamedb (level, score)
      VALUES (${level}, ${score});
    `;

    // return response
    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
