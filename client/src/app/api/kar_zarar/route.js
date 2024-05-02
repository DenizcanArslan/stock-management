import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(request) {
  try {
    // SQL sorgusunu çalıştır
    const result = await sql`
        SELECT
        ms.stok_kodu,
        ms.stok_adi,
        ms.satis_tarihi,
        mk.tarih AS mal_kabul_tarihi,
        ms.birim AS mal_satis_birimi,
        mk.birim AS mal_kabul_birimi,
        ms.satis_fiyati,
        mk.fiyat AS mal_kabul_fiyati,
        COALESCE(ms.satis_fiyati, 0) - mk.fiyat AS kar_zarar
    FROM
        mal_satis ms
    JOIN
        mal_kabul mk ON ms.stok_kodu = mk.stok_kodu
    ORDER BY
        ms.stok_kodu;
    
        `;

    // Verileri JSON formatında döndürme
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    // Hata durumunda uygun bir yanıt döndür
    console.error("Hata:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
