import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(request) {
    try {
        // İstek URL'inden stok_kodu parametresini alın
        const url = new URL(request.url);
        const stokKodu = url.searchParams.get('stok_kodu');

        // Stok_kodu kullanarak mal_kabul tablosundaki kaydı silme
        const result = await sql`
            DELETE FROM mal_kabul
            WHERE stok_kodu = ${stokKodu}
            RETURNING *;`;

        // Silme işleminin sonucunu kontrol edin
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Kayit bulunamadi' }, { status: 404 });
        }

        // Silinen kaydı yanıt olarak döndürün
        const response = NextResponse.json({ data: result.rows[0] }, { status: 200 });
        // Cache'i engellemek için Cache-Control başlığını ayarla
        response.headers.set('Cache-Control', 'no-store');
        
        return response;
    } catch (error) {
        console.error('Hata:', error);
        // Hata durumunda uygun bir yanıt döndür
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
