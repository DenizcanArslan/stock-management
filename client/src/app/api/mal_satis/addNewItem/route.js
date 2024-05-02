import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function POST(request) {
    try {
        // İstek gövdesinden gelen veriyi JSON formatında alın
        const body = await request.json();
        
        // Gelen verileri al
        const { stok_kodu, stok_adi, satis_tarihi, birim, satis_fiyati } = body;

        // Yeni kaydı mal_satis tablosuna ekleme
        const result = await sql`
            INSERT INTO mal_satis (stok_kodu, stok_adi, satis_tarihi, birim, satis_fiyati)
            VALUES (${stok_kodu}, ${stok_adi}, ${satis_tarihi}, ${birim}, ${satis_fiyati})
            RETURNING *;`;

        // Ekleme işleminin sonucu olan yeni kaydı döndür
        return NextResponse.json({ data: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Hata:', error);
        // Hata durumunda uygun bir yanıt döndür
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
