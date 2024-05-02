"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css"; // Modal'ın stillerini import ediyoruz

import { MdEditSquare } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const MalKabulTable = () => {
  const [data, setData] = useState([]); // state for all data
  const [refreshData, setRefreshData] = useState(false); // useEffect'in tekrar çalışmasını kontrol etmek için kullanılır

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal'ı kontrol etmek için bir state
  const [selectedItem, setSelectedItem] = useState(null); // Seçilen öğeyi tutmak için bir state

  const endpoint = ("http://localhost:3000/api/mal_kabul/getAll"); // to get all data//
  const SingleDataEndpoint = "http://localhost:3000/api/mal_kabul/getById"; // to get all data//
  const deleteEndpoint = "http://localhost:3000/api/mal_kabul/deleteAnItem";
 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
 


  //states to store changed data of product
  const [Single_stok_kodu, setSingle_stok_kodu] = useState();
  const [Single_stok_adi, setSingle_stok_adi] = useState("");
  const [Single_tarih, setSingle_tarih] = useState();
  const [Single_birim, setSingle_birim] = useState();
  const [Single_fiyat, setSingle_fiyat] = useState();

  // Tarihi DD.MM.YYYY formatında biçimlendirme fonksiyonu
  const formatDateToDMY = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatUTCDateToLocalDMY = (utcDateString) => {
    const date = new Date(utcDateString);
    date.setDate(date.getDate() ); // Tarihi 1 gün arttirarak veritabanındaki tarihle eşleşmesi için ayarlama
    // Yerel zamana dönüştür ve DD.MM.YYYY formatında biçimlendir
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Yerel tarihten UTC tarihine dönüştürme
const convertLocalDateToUTC = (localDateString) => {
  const date = new Date(localDateString);
  // UTC formatına dönüştür ve döndür
  return date.toISOString();
};


  useEffect(() => {
    // axios ile GET isteği gönderme
    axios
      .get(endpoint)
      .then((response) => {
        // Yanıtın data kısmını state'e kaydetme
        setData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Verileri alma hatasi:", error);
      });
  }, [refreshData]);

//   const adjustDate = (dateString) => {
//     const date = new Date(dateString);
//     date.setDate(date.getDate() + 1);
//     return date.toISOString().split('T')[0];
// };

  
  // "Kaydet ve Kapat" butonuna basıldığında çalışacak fonksiyon
  const handleSaveAndClose = async () => {

    // const adjustedDate = adjustDate(Single_tarih);

    const utcTarih = convertLocalDateToUTC(Single_tarih);



    // Modal'daki verileri al
    const data = {
      stok_kodu: Single_stok_kodu,
      stok_adi: Single_stok_adi,
      tarih: utcTarih,
      birim: Single_birim,
      fiyat: Single_fiyat,
    };

        // Tarih verisini UTC formatına dönüştürün
    // Kullanıcının girdiği tarih `Single_satis_tarihi`'yi UTC'ye dönüştürün
   

    try {
 

      // PUT isteği göndererek veritabanında güncelleme işlemini gerçekleştirin
      const response = await axios.put(
        // Güncelleme isteği için endpoint URL'sini belirleyin
        "http://localhost:3000/api/mal_kabul/updateAnItem",
        // İstek gövdesine güncellenecek veriyi ekleyin
        data
      );

      // İsteğin başarılı olup olmadığını kontrol edin
      if (response.status === 200) {
        console.log("Başarılı güncelleme:", response.data);
        // Gerekirse tabloyu güncelleyin (örneğin, verileri yeniden yükleyin)
        // Tabloyu yeniden yükleme işlemi gerekirse buraya eklenebilir

       // `refreshData` state'ini değiştirerek `useEffect`'in tekrar çalışmasını tetikleyin
       setRefreshData((prev) => !prev);
        

        
        // Modal'ı kapatın
        handleCloseModal();
      } else {
        console.error("Güncelleme başarısız:", response.data);
      }
    } catch (error) {
      console.error("PUT isteği sırasında hata:", error);
    }
  }


  const getSingleData = async (id) => {
    try {
      // Endpoint URL'sini ve stok kodunu kullanarak GET isteği gönderin
      const response = await axios.get(SingleDataEndpoint, {
        params: { stok_kodu: id },
      });

      // Yanıtı döndürün
      return response.data;
    } catch (error) {
      // Hata varsa, hatayı yakalayıp konsola yazdırın
      console.error("Veri alma hatasi:", error);
      throw error;
    }
  };

  const adjustDateByOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    // Tarihi ISO formatında date input'un formatına uygun şekilde geri dön
    return date.toISOString().split("T")[0];
};


  const handleEditClick = async (id) => {
    const itemData = await getSingleData(id);
    setSelectedItem(itemData);

    // Verileri ayrı ayrı statelere atama
    setSingle_stok_adi(itemData.data.stok_adi);


    // Gelen tarihi ISO formatında date input'unun formatına uygun hale getirin
    setSingle_tarih(adjustDateByOneDay(itemData.data.tarih));

    setSingle_birim(itemData.data.birim);
    setSingle_fiyat(itemData.data.fiyat);
    setSingle_stok_kodu(itemData.data.stok_kodu);
    setIsModalOpen(true);
  };

  // Modal'ı kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };


  // Silme modal'ını açma işlevi
const handleDeleteClick = (item) => {
  setItemToDelete(item);
  setIsDeleteModalOpen(true);
};

// Silme işlemini gerçekleştiren işlev
const handleDeleteConfirmation = async () => {
  if (itemToDelete) {
    try {
      // DELETE isteği gönderme
      await axios.delete(`${deleteEndpoint}?stok_kodu=${itemToDelete.stok_kodu}`);

      // Silinen ürünü verilerden çıkarma
      setData(data.filter((item) => item.stok_kodu !== itemToDelete.stok_kodu));

      // Modal'ı kapat
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Ürünü silme hatasi:", error);
    }
  }
};



  return (
    <div>
      <div className="text-center my-10 uppercase text-3xl">
        {" "}
        <h1>Mal Kabul Listesi</h1>
      </div>
      <div id="tableContainer">
        <table className="table-auto w-full text-center">
          <thead>
            <tr>
              <th>Stok Kodu</th>
              <th>Stok Adi </th>
              <th>Tarih </th>
              <th>Birim (kg) </th>
              <th> Fiyat (TL) </th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.stok_kodu}</td>
                <td> {item.stok_adi}</td>
                <td> {formatUTCDateToLocalDMY(item.tarih)}</td>
                <td> {item.birim}</td>
                <td> {item.fiyat}</td>
                <td>
                  <span className="mx-2">
                    <button
                      className="text-2xl text-yellow-500"
                      id="edit-button"
                      onClick={() => handleEditClick(item.stok_kodu)}
                    >
                      <MdEditSquare />
                    </button>
                  </span>
                  <span className="mx-2">
                    <button className="text-2xl text-red-500" onClick={() => handleDeleteClick(item)}>
                      <RiDeleteBinLine />
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal bileşeni */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        center
        classNames={{
          modal: "w-2/3 p-4",
        }}
      >
        {selectedItem && (
          <div>
            <h2 className="text-2xl mb-4">Düzenle</h2>
            {/* Modal içeriği */}
            <div className="mb-2">
              <label className="block mb-1">Stok Adı:</label>
              <input
                type="text"
                value={Single_stok_adi}
                onChange={(e) => setSingle_stok_adi(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Tarih:</label>
              <input
                type="date"
                value={Single_tarih}
                onChange={(e) => setSingle_tarih(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Birim:</label>
              <input
                type="text"
                value={Single_birim}
                onChange={(e) => setSingle_birim(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Fiyat:</label>
              <input
                type="number"
                value={Single_fiyat}
                onChange={(e) => setSingle_fiyat(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveAndClose}
              >
                Kaydet ve Kapat
              </button>
            </div>
          </div>
        )}
      </Modal>

{/* Silme Modal'ı */}
<Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} center>
        <h2 className="text-2xl mb-4">Silme Onayı</h2>
        <p>Bu öğeyi silmek istediğinizden emin misiniz?</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleDeleteConfirmation}
          >
            Evet
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Hayır
          </button>
        </div>
      </Modal>



    </div>
  );
};
export const revalidate = 0

export const dynamic = 'force-dynamic';

export default MalKabulTable;
