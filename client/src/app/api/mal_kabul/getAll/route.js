import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(request) {
    try {
        // Gelen isteğe bağlı olarak güncel verileri sorgulama
        console.log(request.url); // Gerekirse, isteğin URL'sini konsola yazdırabilirsiniz

        // mal_kabul tablosundaki tüm verileri sorgulama
        const result = await sql`SELECT * FROM mal_kabul ORDER BY stok_kodu;`;

        // Verileri JSON formatında döndürme
        const response = NextResponse.json({ data: result.rows }, { status: 200 });

        // Cache'i engellemek için Cache-Control başlığını ayarla
        response.headers.set('Cache-Control', 'no-store');
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
