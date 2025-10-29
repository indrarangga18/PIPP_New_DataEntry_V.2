import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Produksi from './pages/Produksi'
import DistribusiIkan from './pages/DistribusiIkan'
import DistribusiIkanPemasaranMasuk from './pages/DistribusiIkanPemasaranMasuk'
import DistribusiIkanPemasaranKeluar from './pages/DistribusiIkanPemasaranKeluar'
import UsahaPendapatanPelabuhan from './pages/UsahaPendapatanPelabuhan'
import DokumenPelabuhanPerikanan from './pages/DokumenPelabuhanPerikanan'
import Fasilitas from './pages/Fasilitas'
import Website from './pages/Website'
import Berita from './pages/Berita'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import MasterData from './pages/MasterData'
import MasterDataPelabuhan from './pages/MasterDataPelabuhan'
import MasterDataSumberDana from './pages/MasterDataSumberDana'
import MasterDataJenisKonstruksi from './pages/MasterDataJenisKonstruksi'
import MasterDataJenisFasilitas from './pages/MasterDataJenisFasilitas'
import MasterDataKondisi from './pages/MasterDataKondisi'
import MasterDataTransportasi from './pages/MasterDataTransportasi'
import MasterDataJenisIkan from './pages/MasterDataJenisIkan'
import MasterDataTipeDokumen from './pages/MasterDataTipeDokumen'
import PelabuhanKondisiFisik from './pages/Profil Pelabuhan/KondisiFisik'
import PelabuhanDataUmum from './pages/Profil Pelabuhan/DataUmum'
import PelabuhanInformasiWilayah from './pages/Profil Pelabuhan/InformasiWilayah'
import PelabuhanAkses from './pages/Profil Pelabuhan/Akses'
import PelabuhanAmenities from './pages/Profil Pelabuhan/Amenities'
import PelabuhanTransportasi from './pages/Profil Pelabuhan/Transportasi'
import PelabuhanPemangkuKepentingan from './pages/Profil Pelabuhan/PemangkuKepentingan'
import PelabuhanMasalahUpaya from './pages/Profil Pelabuhan/MasalahUpaya'
import PelabuhanMonitoringK5 from './pages/Profil Pelabuhan/MonitoringK5'
import PelabuhanKelembagaanUPT from './pages/Profil Pelabuhan/KelembagaanUPT'
import PelabuhanPenyaluranPerbekalan from './pages/Profil Pelabuhan/PenyaluranPerbekalan'
import PelabuhanTargetPNBPSDA from './pages/Profil Pelabuhan/TargetPNBPSDA'
import PelabuhanIndeksKepuasanMasyarakat from './pages/Profil Pelabuhan/IndeksKepuasanMasyarakat'
import PelabuhanTataKelolaLingkungan from './pages/Profil Pelabuhan/TataKelolaLingkungan'
import PelabuhanKebersihanKolam from './pages/Profil Pelabuhan/KebersihanKolam'
import PelabuhanKebersihanDaratan from './pages/Profil Pelabuhan/KebersihanDaratan'
import PelabuhanBimtekCPIB from './pages/Profil Pelabuhan/BimtekCPIB'
import FasilitasPokokJalan from './pages/FasilitasPokokJalan'
import FasilitasPokokGroin from './pages/FasilitasPokokGroin'
import FasilitasPokokDrainaseJembatan from './pages/FasilitasPokokDrainaseJembatan'
import FasilitasPokokRevetment from './pages/FasilitasPokokRevetment'
import FasilitasPokokBreakwater from './pages/FasilitasPokokBreakwater'
import FasilitasPokokSaranaBantuNavigasi from './pages/FasilitasPokokSaranaBantuNavigasi'
import FasilitasPokokKolamPelabuhan from './pages/FasilitasPokokKolamPelabuhan'
import FasilitasPokokDermaga from './pages/FasilitasPokokDermaga'
import FasilitasPokokTanah from './pages/FasilitasPokokTanah'
import FasilitasFungsionalTempatPemasaranIkan from './pages/FasilitasFungsionalTempatPemasaranIkan'
import FasilitasFungsionalMenaraPengawasan from './pages/FasilitasFungsionalMenaraPengawasan'
import FasilitasFungsionalFasilitasKomunikasi from './pages/FasilitasFungsionalFasilitasKomunikasi'
import FasilitasFungsionalPemadamKebakaran from './pages/FasilitasFungsionalPemadamKebakaran'
import FasilitasFungsionalAirBbmEsListrik from './pages/FasilitasFungsionalAirBbmEsListrik'
import FasilitasFungsionalPemeliharaanKapal from './pages/FasilitasFungsionalPemeliharaanKapal'
import FasilitasFungsionalPemeliharaanAlatTangkap from './pages/FasilitasFungsionalPemeliharaanAlatTangkap'
import FasilitasFungsionalPenangkapanPengolahan from './pages/FasilitasFungsionalPenangkapanPengolahan'
import FasilitasFungsionalPerkantoran from './pages/FasilitasFungsionalPerkantoran'
import FasilitasFungsionalTransportasi from './pages/FasilitasFungsionalTransportasi'
import FasilitasFungsionalKebersihanLimbah from './pages/FasilitasFungsionalKebersihanLimbah'
import FasilitasPenunjangBalaiPertemuanNelayan from './pages/FasilitasPenunjangBalaiPertemuanNelayan'
import FasilitasPenunjangMesOperator from './pages/FasilitasPenunjangMesOperator'
import FasilitasPenunjangWismaNelayan from './pages/FasilitasPenunjangWismaNelayan'
import FasilitasPenunjangFasilitasSosialUmum from './pages/FasilitasPenunjangFasilitasSosialUmum'
import FasilitasPenunjangShelterNelayan from './pages/FasilitasPenunjangShelterNelayan'
import FasilitasPenunjangPertokoanKiosNelayan from './pages/FasilitasPenunjangPertokoanKiosNelayan'
import FasilitasPenunjangPengamananKawasan from './pages/FasilitasPenunjangPengamananKawasan'
import FasilitasPenunjangPasarIkan from './pages/FasilitasPenunjangPasarIkan'

function App() {
  useEffect(() => { document.title = 'New Data Entry PIPP' }, [])
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produksi" element={<Produksi />} />
        <Route path="/distribusi-ikan" element={<DistribusiIkan />} />
        <Route path="/distribusi-ikan/pemasaran-masuk" element={<DistribusiIkanPemasaranMasuk />} />
        <Route path="/distribusi-ikan/pemasaran-keluar" element={<DistribusiIkanPemasaranKeluar />} />
        <Route path="/usaha-pendapatan-pelabuhan" element={<UsahaPendapatanPelabuhan />} />
        <Route path="/dokumen-pelabuhan-perikanan" element={<DokumenPelabuhanPerikanan />} />
        <Route path="/fasilitas" element={<Fasilitas />} />
        <Route path="/fasilitas/pokok/jalan" element={<FasilitasPokokJalan />} />
        <Route path="/fasilitas/pokok/groin" element={<FasilitasPokokGroin />} />
        <Route path="/fasilitas/pokok/drainase-jembatan" element={<FasilitasPokokDrainaseJembatan />} />
        <Route path="/fasilitas/pokok/revetment" element={<FasilitasPokokRevetment />} />
        <Route path="/fasilitas/pokok/breakwater" element={<FasilitasPokokBreakwater />} />
        <Route path="/fasilitas/pokok/sarana-bantu-navigasi" element={<FasilitasPokokSaranaBantuNavigasi />} />
        <Route path="/fasilitas/pokok/kolam-pelabuhan" element={<FasilitasPokokKolamPelabuhan />} />
        <Route path="/fasilitas/pokok/dermaga" element={<FasilitasPokokDermaga />} />
        <Route path="/fasilitas/pokok/tanah" element={<FasilitasPokokTanah />} />
        {/* Fasilitas Fungsional */}
        <Route path="/fasilitas/fungsional/tempat-pemasaran-ikan" element={<FasilitasFungsionalTempatPemasaranIkan />} />
        <Route path="/fasilitas/fungsional/menara-pengawasan" element={<FasilitasFungsionalMenaraPengawasan />} />
        <Route path="/fasilitas/fungsional/fasilitas-komunikasi" element={<FasilitasFungsionalFasilitasKomunikasi />} />
        <Route path="/fasilitas/fungsional/pemadam-kebakaran" element={<FasilitasFungsionalPemadamKebakaran />} />
        <Route path="/fasilitas/fungsional/air-bbm-es-listrik" element={<FasilitasFungsionalAirBbmEsListrik />} />
        <Route path="/fasilitas/fungsional/pemeliharaan-kapal" element={<FasilitasFungsionalPemeliharaanKapal />} />
        <Route path="/fasilitas/fungsional/pemeliharaan-alat-tangkap" element={<FasilitasFungsionalPemeliharaanAlatTangkap />} />
        <Route path="/fasilitas/fungsional/penangkapan-pengolahan" element={<FasilitasFungsionalPenangkapanPengolahan />} />
        <Route path="/fasilitas/fungsional/perkantoran" element={<FasilitasFungsionalPerkantoran />} />
        <Route path="/fasilitas/fungsional/transportasi" element={<FasilitasFungsionalTransportasi />} />
        <Route path="/fasilitas/fungsional/kebersihan-limbah" element={<FasilitasFungsionalKebersihanLimbah />} />
        {/* Fasilitas Penunjang */}
        <Route path="/fasilitas/penunjang/balai-pertemuan-nelayan" element={<FasilitasPenunjangBalaiPertemuanNelayan />} />
        <Route path="/fasilitas/penunjang/mes-operator" element={<FasilitasPenunjangMesOperator />} />
        <Route path="/fasilitas/penunjang/wisma-nelayan" element={<FasilitasPenunjangWismaNelayan />} />
        <Route path="/fasilitas/penunjang/fasilitas-sosial-dan-umum" element={<FasilitasPenunjangFasilitasSosialUmum />} />
        <Route path="/fasilitas/penunjang/tempat-istirahat-shelter-nelayan" element={<FasilitasPenunjangShelterNelayan />} />
        <Route path="/fasilitas/penunjang/pertokoan-kios-nelayan" element={<FasilitasPenunjangPertokoanKiosNelayan />} />
        <Route path="/fasilitas/penunjang/fasilitas-pengamanan-kawasan" element={<FasilitasPenunjangPengamananKawasan />} />
        <Route path="/fasilitas/penunjang/pasar-ikan" element={<FasilitasPenunjangPasarIkan />} />
        <Route path="/website" element={<Website />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/pengaturan" element={<Settings />} />
        {/* Pelabuhan */}
        <Route path="/pelabuhan/kondisi-fisik" element={<PelabuhanKondisiFisik />} />
        <Route path="/pelabuhan/data-umum" element={<PelabuhanDataUmum />} />
        <Route path="/pelabuhan/informasi-wilayah" element={<PelabuhanInformasiWilayah />} />
        <Route path="/pelabuhan/akses" element={<PelabuhanAkses />} />
        <Route path="/pelabuhan/amenities" element={<PelabuhanAmenities />} />
        <Route path="/pelabuhan/transportasi" element={<PelabuhanTransportasi />} />
        <Route path="/pelabuhan/pemangku-kepentingan" element={<PelabuhanPemangkuKepentingan />} />
        <Route path="/pelabuhan/masalah-upaya" element={<PelabuhanMasalahUpaya />} />
        <Route path="/pelabuhan/monitoring-k5" element={<PelabuhanMonitoringK5 />} />
        <Route path="/pelabuhan/kelembagaan-upt" element={<PelabuhanKelembagaanUPT />} />
        <Route path="/pelabuhan/penyaluran-perbekalan" element={<PelabuhanPenyaluranPerbekalan />} />
        <Route path="/pelabuhan/target-pnbp-sda" element={<PelabuhanTargetPNBPSDA />} />
        <Route path="/pelabuhan/indeks-kepuasan-masyarakat" element={<PelabuhanIndeksKepuasanMasyarakat />} />
        <Route path="/pelabuhan/tata-kelola-lingkungan" element={<PelabuhanTataKelolaLingkungan />} />
        <Route path="/pelabuhan/kebersihan-kolam" element={<PelabuhanKebersihanKolam />} />
        <Route path="/pelabuhan/kebersihan-daratan" element={<PelabuhanKebersihanDaratan />} />
        <Route path="/pelabuhan/bimtek-cpib" element={<PelabuhanBimtekCPIB />} />
        <Route path="/master-data" element={<MasterData />} />
        <Route path="/master-data/pelabuhan" element={<MasterDataPelabuhan />} />
        <Route path="/master-data/sumber-dana" element={<MasterDataSumberDana />} />
        <Route path="/master-data/jenis-konstruksi" element={<MasterDataJenisKonstruksi />} />
        <Route path="/master-data/jenis-fasilitas" element={<MasterDataJenisFasilitas />} />
        <Route path="/master-data/kondisi" element={<MasterDataKondisi />} />
        <Route path="/master-data/transportasi" element={<MasterDataTransportasi />} />
        <Route path="/master-data/jenis-ikan" element={<MasterDataJenisIkan />} />
        <Route path="/master-data/tipe-dokumen" element={<MasterDataTipeDokumen />} />
      </Routes>
    </AppLayout>
  )
}

export default App
