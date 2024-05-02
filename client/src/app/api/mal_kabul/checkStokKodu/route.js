import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
    // Gelen isteğin URL'sini ve sorgu parametrelerini al
    const url = new URL(request.url);
    const stokKodu = url.searchParams.get('stok_kodu');

    if (!stokKodu) {
        // stok_kodu parametresi sağlanmadıysa hata döndür
        return NextResponse.json({ error: 'stok_kodu sorgu parametresi eksik.' }, { status: 400 });
    }

    try {
        // Veritabanında stok_kodu kontrolü
        const result = await sql`
            SELECT COUNT(*) AS count
            FROM mal_kabul
            WHERE stok_kodu = ${stokKodu};
        `;

        const count = parseInt(result.rows[0].count, 10);

        if (count > 0) {
            // Stok kodu mevcutsa true döndür
            return NextResponse.json({ exists: true }, { status: 200 });
        } else {
            // Stok kodu mevcut değilse false döndür
            return NextResponse.json({ exists: false }, { status: 200 });
        }
    } catch (error) {
        // Hata durumunda 500 hata kodunu ve hata mesajını döndür
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
