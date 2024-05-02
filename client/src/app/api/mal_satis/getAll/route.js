import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(request) {
    try {
        // mal_satis tablosundaki tüm verileri sorgulama
        const result = await sql`SELECT * FROM mal_satis ORDER BY stok_kodu;`;

        // Verileri JSON formatında döndürme
        return NextResponse.json({ data: result.rows }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
