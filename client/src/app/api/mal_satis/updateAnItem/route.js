import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function PUT(request) {
    try {
        // İstek gövdesinden gelen veriyi JSON formatında alın
        const body = await request.json();
        
        // Gelen verileri al
        const { stok_kodu, stok_adi, satis_tarihi, birim, satis_fiyati } = body;

        // Veritabanındaki kaydı güncelleme
        const result = await sql`
            UPDATE mal_satis
            SET stok_adi = ${stok_adi},
                satis_tarihi = ${satis_tarihi},
                birim = ${birim},
                satis_fiyati = ${satis_fiyati}
            WHERE stok_kodu = ${stok_kodu}
            RETURNING *;`;

        // Güncelleme işleminin sonucu olan kaydı yanıt olarak döndür
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Kayit bulunamadi' }, { status: 404 });
        }

        return NextResponse.json({ data: result.rows[0] }, { status: 200 });
        
    } catch (error) {
        console.error('Hata:', error);
        // Hata durumunda uygun bir yanıt döndür
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
