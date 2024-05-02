import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const stok_kodu = searchParams.get('stok_kodu');

    if (!stok_kodu) {
        return NextResponse.json({ error: 'ID parametresi eksik' }, { status: 400 });
    }

    try {
        // Belirli bir ID'ye sahip mal_satis kaydını sorgulama
        const result = await sql`SELECT * FROM mal_satis WHERE Stok_kodu = ${stok_kodu};`;

        // Sonuçları JSON formatında döndürme
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Kayit bulunamadi' }, { status: 404 });
        }

        return NextResponse.json({ data: result.rows[0] }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
