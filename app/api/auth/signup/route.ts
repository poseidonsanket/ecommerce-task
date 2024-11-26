import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const client = await pool.connect();
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      client.release();
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );

    const token = jwt.sign({ userId: result.rows[0].id }, process.env.NEXT_PUBLIC_JWT_SECRET!, { expiresIn: '1h' });

    client.release();

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

