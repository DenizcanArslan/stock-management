"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";


const KarZararTable = () => {
  const [data, setData] = useState([]); // Tüm verileri saklar
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş verileri saklar
  const [minKarZarar, setMinKarZarar] = useState(0); // Minimum kar/zarar yüzdesi
  const [maxKarZarar, setMaxKarZarar] = useState(100); // Maksimum kar/zarar yüzdesi
  const endpoint = "http://localhost:3000/api/kar_zarar";

  // Tarihi DD.MM.YYYY formatında biçimlendirme fonksiyonu
  const formatDateToDMY = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ocak ayı 0. aydır
    const year = date.getFullYear();

    // Format: DD.MM.YYYY
    return `${day}.${month}.${year}`;
  };

  // Verileri alma işlemi
  useEffect(() => {
    axios
      .get(endpoint)
      .then((response) => {
        const allData = response.data.data; // Gelen verileri al
        setData(allData);
        filterData(allData); // Filtreleme işlemini başlat
      })
      .catch((error) => {
        console.error("Verileri alma hatası:", error);
      });
  }, []);

  // Kar/Zarar oranını hesaplama
  const karZararFunction = (kar_zarar, mal_kabul_fiyati) => {
    const yuzdeOran = (kar_zarar / mal_kabul_fiyati) * 100;
    return yuzdeOran;
  };

  // Verileri filtreleme işlemi
  const filterData = (allData) => {
    const filtered = allData.filter((item) => {
      const yuzdeOran = karZararFunction(item.kar_zarar, item.mal_kabul_fiyati);
      return yuzdeOran >= minKarZarar && yuzdeOran <= maxKarZarar;
    });
    setFilteredData(filtered); // Filtrelenmiş verileri günceller
  };

  // Kullanıcının aralığı belirlemesi için range inputlarını tanımlama
  useEffect(() => {
    // minKarZarar veya maxKarZarar değiştiğinde verileri filtrele
    filterData(data);
  }, [minKarZarar, maxKarZarar, data]);


  const downloadExcel = () => {
    // Verileri işleme ve kar/zarar yüzde sütununu ekleme
    const formattedData = filteredData.map((item) => {
      const yuzdeOran = karZararFunction(item.kar_zarar, item.mal_kabul_fiyati).toFixed(2);
      return {
        ...item, // Mevcut verileri koruyun
        "Kar/Zarar (%)": `${yuzdeOran}%`, // Kar/zarar yüzde değerini ekleyin
      };
    });
  
    // Verileri çalışma sayfasına dönüştürme
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Çalışma sayfasını bir çalışma kitabına dönüştürme
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KarZararListesi');
    
    // Excel dosyasını ikili dize olarak oluşturma
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // İkili dizeyi bir Blob'a dönüştürme
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Excel dosyasını indirmek için bir bağlantı oluşturma
    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kar_zarar_listesi.xlsx');
    document.body.appendChild(link);
    link.click();
    
    // Bağlantıyı kaldırma
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="text-center my-10 uppercase text-3xl">
        <h1>KAR ZARAR LISTESI</h1>
      </div>

      {/* Kullanıcının min ve max kar/zarar yüzdesi aralığını ayarladığı inputlar */}
      <div className="mb-4 flex justify-center space-x-4">
        <div>
          <label htmlFor="minKarZarar" className="block text-gray-700">
            Min Kar/Zarar (%):
          </label>
          <input
            type="range"
            id="minKarZarar"
            name="minKarZarar"
            min="0"
            max="100"
            value={minKarZarar}
            onChange={(e) => setMinKarZarar(Number(e.target.value))}
            className="w-full"
          />
          <span>{minKarZarar}%</span>
        </div>
        <div>
          <label htmlFor="maxKarZarar" className="block text-gray-700">
            Max Kar/Zarar (%):
          </label>
          <input
            type="range"
            id="maxKarZarar"
            name="maxKarZarar"
            min="0"
            max="100"
            value={maxKarZarar}
            onChange={(e) => setMaxKarZarar(Number(e.target.value))}
            className="w-full"
          />
          <span>{maxKarZarar}%</span>
        </div>
      </div>

{/* Excel dosyasını indirme butonu */}
<div className="text-center my-4">
        <button
          onClick={downloadExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Excel Olarak İndir
        </button>
      </div>


      {/* Tablo */}
      <div id="tableContainer">
        <table className="table-auto w-full text-center">
          <thead>
            <tr>
              <th>Stok Kodu</th>
              <th>Stok Adı</th>
              <th>Mal Kabul Tarihi</th>
              <th>Mal Satış Tarihi</th>
              <th>Birim</th>
              <th>Mal Kabul Fiyatı (TL)</th>
              <th>Satış Fiyatı (TL)</th>
              <th>Kar/Zarar (TL)</th>
              <th>Kar Zarar (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.stok_kodu}</td>
                <td>{item.stok_adi}</td>
                <td>{formatDateToDMY(item.mal_kabul_tarihi)}</td>
                <td>{formatDateToDMY(item.satis_tarihi)}</td>
                <td>{item.mal_satis_birimi}</td>
                <td>{item.mal_kabul_fiyati}</td>
                <td>{item.satis_fiyati}</td>
                <td>{item.kar_zarar}</td>
                <td>{karZararFunction(item.kar_zarar, item.mal_kabul_fiyati).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KarZararTable;
