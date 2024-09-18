/* import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
 
 const body = await request.json()
 console.log(body)

  const gamedb = await sql`SELECT * FROM Gamedb;`;
  return NextResponse.json({ gamedb }, { status: 200 });
} */

  import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Получаем данные из тела запроса
    const { level, score } = await request.json();

    // Проверка данных
    if (level === undefined || score === undefined) {
      return NextResponse.json({ error: 'Missing level or score' }, { status: 400 });
    }

    // Вставляем данные в таблицу Gamedb
    await sql`
      INSERT INTO Gamedb (level, score)
      VALUES (${level}, ${score});
    `;

    // Возвращаем успешный ответ
    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
