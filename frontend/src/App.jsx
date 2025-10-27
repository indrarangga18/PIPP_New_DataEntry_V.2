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
        <Route path="/website" element={<Website />} />
        <Route path="/dokumen" element={<Dokumen />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/pengaturan" element={<Settings />} />
      </Routes>
    </AppLayout>
  )
}

export default App
