"use client"
import React, { useState } from 'react';
import axios from 'axios';

const MalKabulForm = () => {
    // Form veri alanları için state'ler
    const [formData, setFormData] = useState({
        stok_kodu: "",
        stok_adi: "",
        tarih: "",
        birim: "",
        fiyat: "",
    });

    

    // Form alanlarını güncellemek için işlev
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Form gönderildiğinde yapılacak işlemler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // axios POST isteği
            const response = await axios.post('/api/mal_kabul/addNewItem', formData);

            if (response.status === 201) {
                console.log('Başarılı gönderim:', response.data);
                // Başarılı gönderim sonrası yapılacak işlemler
                // Örneğin, başarı mesajı veya başka bir sayfaya yönlendirme

                setFormData({
                    stok_kodu: "",
                    stok_adi: "",
                    tarih: "",
                    birim: "",
                    fiyat: "",
                });
            // Başarı uyarısını göster
            window.alert('Veriler başarıyla gönderildi!');


            } else {
                console.error('Gönderim başarısız:', response.statusText);
                // Başarısız gönderim durumunda yapılacak işlemler
            }
        } catch (error) {
            console.error('Gönderim sırasında hata:', error);
            // Hata durumunda yapılacak işlemler
        }
    };

    return (
        <div className="mt-5 flex flex-col items-center">
            <h2 className="text-2xl mb-4">Mal Kabul Formu</h2>

            <form
                onSubmit={handleSubmit}
                className="w-full p-6 bg-white shadow-md rounded-lg"
            >
                <div className="mb-4">
                    <label htmlFor="stok_kodu" className="block text-gray-700 mb-1">
                        Stok Kodu:
                    </label>
                    <input
                        type="number"
                        id="stok_kodu"
                        name="stok_kodu"
                        value={formData.stok_kodu}
                        onChange={handleChange}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="stok_adi" className="block text-gray-700 mb-1">
                        Stok Adı:
                    </label>
                    <input
                        type="text"
                        id="stok_adi"
                        name="stok_adi"
                        value={formData.stok_adi}
                        onChange={handleChange}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="tarih" className="block text-gray-700 mb-1">
                        Tarih:
                    </label>
                    <input
                        type="date"
                        id="tarih"
                        name="tarih"
                        value={formData.tarih}
                        onChange={handleChange}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="birim" className="block text-gray-700 mb-1">
                        Birim:
                    </label>
                    <input
                        type="number"
                        id="birim"
                        name="birim"
                        value={formData.birim}
                        onChange={handleChange}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="fiyat" className="block text-gray-700 mb-1">
                        Fiyat:
                    </label>
                    <input
                        type="number"
                        id="fiyat"
                        name="fiyat"
                        value={formData.fiyat}
                        onChange={handleChange}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Kaydet
                </button>
            </form>
        </div>
    );
};

export default MalKabulForm;
