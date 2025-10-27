import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Produksi from './pages/Produksi'
import DistribusiIkan from './pages/DistribusiIkan'
import UsahaPendapatanPelabuhan from './pages/UsahaPendapatanPelabuhan'
import DokumenPelabuhanPerikanan from './pages/DokumenPelabuhanPerikanan'
import Fasilitas from './pages/Fasilitas'
import Website from './pages/Website'
import Dokumen from './pages/Dokumen'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import FasilitasPokokJalan from './pages/FasilitasPokokJalan'
import FasilitasPokokGroin from './pages/FasilitasPokokGroin'
import FasilitasPokokDrainaseJembatan from './pages/FasilitasPokokDrainaseJembatan'
import FasilitasPokokRevetment from './pages/FasilitasPokokRevetment'
import FasilitasPokokBreakwater from './pages/FasilitasPokokBreakwater'
import FasilitasPokokSaranaBantuNavigasi from './pages/FasilitasPokokSaranaBantuNavigasi'
import FasilitasPokokKolamPelabuhan from './pages/FasilitasPokokKolamPelabuhan'
import FasilitasPokokDermaga from './pages/FasilitasPokokDermaga'
import FasilitasPokokTanah from './pages/FasilitasPokokTanah'

function App() {
  useEffect(() => { document.title = 'New Data Entry PIPP' }, [])
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produksi" element={<Produksi />} />
        <Route path="/distribusi-ikan" element={<DistribusiIkan />} />
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
        <Route path="/website" element={<Website />} />
        <Route path="/dokumen" element={<Dokumen />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/pengaturan" element={<Settings />} />
      </Routes>
    </AppLayout>
  )
}

export default App
