import React, { useState,useEffect } from 'react';
import { db } from './firebase';
import { collection,doc,addDoc,deleteDoc,updateDoc,query,onSnapshot} from 'firebase/firestore';

export default function App() {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [veriListesi, setVeriListesi] = useState([])
  const [modalGorunurYap, setModalGorunurYap] = useState(false);
  const [duzenlenecekVeri, setDuzenlenecekVeri] = useState(null);
  const [yeniAd, setYeniAd] = useState('');
  const [yeniSoyad, setYeniSoyad] = useState('');
  const [yeniEposta, setYeniEposta] = useState('');

  const veriEkleme = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'veriler'), {
        ad: ad,
        soyad: soyad,
        eposta: eposta,
      });
      setAd('');
      setSoyad('');
      setEposta('');
      console.log('Veri eklendi');
    } catch (err) {
      alert(err);
    }
  };

  const veriSilme = async (id) => {
    try {
      const veriDocRef = doc(db, 'veriler', id);
      await deleteDoc(veriDocRef);
      console.log('Veri başarıyla silindi');
    } catch (err) {
      console.error('Veri silme hatası:', err);
    }
  };

  const modalAc = (veri) => {
    setModalGorunurYap(true);
    setDuzenlenecekVeri(veri);
    setYeniAd(veri.data.ad);
    setYeniSoyad(veri.data.soyad);
    setYeniEposta(veri.data.eposta);
  };

  const modalKapat = () => {
    setModalGorunurYap(false);
    setDuzenlenecekVeri(null);
    setYeniAd('');
    setYeniSoyad('');
    setYeniEposta('');
  };

  const veriDuzenle = async () => {
    try {
      const veriDocRef = doc(db, 'veriler', duzenlenecekVeri.id);
      await updateDoc(veriDocRef, {
        ad: yeniAd,
        soyad: yeniSoyad,
        eposta: yeniEposta,
      });
      console.log('Veri başarıyla güncellendi');
      modalKapat();
    } catch (err) {
      console.error('Veri düzenleme hatası:', err);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'veriler'))
    onSnapshot(q, (querySnapshot) => {
      setVeriListesi(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  return (
    <div>
      <h2>Kayıt Listesi</h2>
      <table>
        <tr>
         
          <th>Ad</th>
          <th>Soyad</th>
          <th>E-posta</th>
          <th>İşlemler</th>
        </tr>
        <tr>
           
          <td>Burak</td>
          <td>Çetin</td>
          <td>burak@cetin.com</td>
          <td>
            <button>Düzenle</button>
            <button>Sil</button>
          </td>
        </tr>
        {veriListesi.map((veri) => (
     <tr key={veri.id}>
    
     <td>{veri.data.ad}</td>
     <td>{veri.data.soyad}</td>
     <td>{veri.data.eposta}</td>
     <td>
     <button onClick={() => modalAc(veri)}>Düzenle</button>
       <button onClick={() => veriSilme(veri.id)}>Sil</button>
     </td>
   </tr>

))}
      </table>
      {modalGorunurYap && (
        <div className="modal">
          <div className="modal-icerik">
            <h2>Veri Düzenle</h2>
            <label htmlFor="yeniAd">Ad:</label>
            <input
              type="text"
              id="yeniAd"
              name="yeniAd"
              value={yeniAd}
              onChange={(e) => setYeniAd(e.target.value)}
            />

            <label htmlFor="yeniSoyad">Soyad:</label>
            <input
              type="text"
              id="yeniSoyad"
              name="yeniSoyad"
              value={yeniSoyad}
              onChange={(e) => setYeniSoyad(e.target.value)}
            />

            <label htmlFor="yeniEposta">E-posta:</label>
            <input
              type="text"
              id="yeniEposta"
              name="yeniEposta"
              value={yeniEposta}
              onChange={(e) => setYeniEposta(e.target.value)}
            />

            <button onClick={veriDuzenle}>Düzenle</button>
            <button onClick={modalKapat}>İptal</button>
          </div>
        </div>
      )}
      <h2>Kayıt Ekleme</h2>
      <form onSubmit={veriEkleme} className="form-container">
        <label htmlFor="ad">Ad:</label>
        <input
          type="text"
          id="ad"
          name="ad"
          placeholder="Adınızı girin..."
          value={ad}
          onChange={(e) => setAd(e.target.value)}
        />

        <label htmlFor="soyad">Soyad:</label>
        <input
          type="text"
          id="soyad"
          name="soyad"
          placeholder="Soyadınızı girin..."
          value={soyad}
          onChange={(e) => setSoyad(e.target.value)}
        />

        <label htmlFor="eposta">E-posta:</label>
        <input
          type="text"
          id="eposta"
          name="eposta"
          placeholder="E-posta adresinizi girin..."
          value={eposta}
          onChange={(e) => setEposta(e.target.value)}
        />

        <input type="submit" value="Kaydet" id="kaydet" />
      </form>
    </div>
  );
}
