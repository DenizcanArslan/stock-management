import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;



export async function PUT(request) {
    try {
        // İstek gövdesinden gelen veriyi JSON formatında alın
        const body = await request.json();

        // Gelen verileri al
        const { stok_kodu, stok_adi, tarih, birim, fiyat } = body;

        // Veritabanındaki kaydı güncelleme
        const result = await sql`
            UPDATE mal_kabul
            SET stok_adi = ${stok_adi},
                tarih = ${tarih},
                birim = ${birim},
                fiyat = ${fiyat}
            WHERE stok_kodu = ${stok_kodu}
            RETURNING *;
        `;

        // Güncelleme işleminin sonucu olan kaydı yanıt olarak döndür
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Kayit bulunamadi' }, { status: 404 });
        }

        // Yanıt oluşturulurken Cache-Control başlığını ayarlama
        const response = NextResponse.json({ data: result.rows[0] }, { status: 200 });
        response.headers.set('Cache-Control', 'no-store');

        return response;
    } catch (error) {
        console.error('Hata:', error);
        // Hata durumunda uygun bir yanıt döndür
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
