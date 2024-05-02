import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request) {
  try {
    const body = await request.json();
    const data = body.filteredData;

    // Verileri çalışma sayfasına dönüştürün
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Çalışma sayfasını bir çalışma kitabına ekleyin
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KarZararListesi');
    
    // Excel dosyasını ikili bir dize olarak oluşturun
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // İkili dizeyi bir Blob'a dönüştürün
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Excel dosyasını Next.js yanıtı olarak gönderin
    const headers = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=kar_zarar_listesi.xlsx',
    };
    
    return new NextResponse(excelBlob, { headers });
  } catch (error) {
    console.error('Hata:', error);
    return new NextResponse('Sunucu hatası', { status: 500 });
  }
}
