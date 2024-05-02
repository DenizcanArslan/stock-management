import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function POST(request) {
    try {
        // İstek gövdesinden gelen veriyi JSON formatında alın
        const body = await request.json();
        
        // Gelen verileri al
        const { stok_kodu, stok_adi, tarih, birim, fiyat } = body;

        // Yeni kaydı mal_kabul tablosuna ekleme
        const result = await sql`
            INSERT INTO mal_kabul (stok_kodu, stok_adi, tarih, birim, fiyat)
            VALUES (${stok_kodu}, ${stok_adi}, ${tarih}, ${birim}, ${fiyat})
            RETURNING *;`;

        // Ekleme işleminin sonucu olan yeni kaydı döndür
        const response = NextResponse.json({ data: result.rows[0] }, { status: 201 });
        response.headers.set('Cache-Control', 'no-store');
        
        return response;

    } catch (error) {
        console.error('Hata:', error);
        // Hata durumunda uygun bir yanıt döndür
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
