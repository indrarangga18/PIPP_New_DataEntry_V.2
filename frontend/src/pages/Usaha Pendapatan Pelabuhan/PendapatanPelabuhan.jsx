import React, { useMemo, useState } from 'react'
import '../../styles/fasilitas-form.css'
import AutoBreadcrumb from '../../components/AutoBreadcrumb'
import FormHeader from '../../components/FormHeader'
import SmartSelect from '../../components/SmartSelect'
import { PELABUHAN_OPTIONS } from '../../utils/formStandards'

export default function PendapatanPelabuhan() {
  const [header, setHeader] = useState({ pelabuhan: '', tanggalCatat: '' })
  const [doShake, setDoShake] = useState(false)

  // Definisi struktur kategori dan item
  const SECTIONS = useMemo(() => ([
    {
      code: 'A', title: 'Pelayanan Tambat dan Labuh', items: [
        { label: 'Pelayanan Tambat untuk Kapal Perikanan', key: 'tambatKapalPerikanan' },
        { label: 'Pelayanan Labuh untuk Kapal Perikanan', key: 'labuhKapalPerikanan' },
        { label: 'Pelayanan Tambat dan/atau Labuh Kapal Non Perikanan', key: 'tambatLabuhNonPerikanan' },
        { label: 'Pelayanan Tambat dan Labuh Kapal Rusak (Floating Repair) menunggu Gilirian Perbaikan dan Perawatan Sebelum Naik', key: 'tambatLabuhFloatingRepair' },
        { label: 'Pelayanan Tambat dan Labuh Kapal Menunggu Musim Cuaca Baik', key: 'tambatLabuhMenungguCuaca' },
      ]
    },
    {
      code: 'B', title: 'Pelayanan Dock', items: [
        { label: 'Pelayanan Dock dengan Pekerjaan', key: 'dockDenganPekerjaan' },
        { label: 'Pelayanan Dock tanpa Pekerjaan', key: 'dockTanpaPekerjaan' },
      ]
    },
    {
      code: 'C', title: 'Pelayanan Pengadaan Air', items: [
        { label: 'Pelayanan pengadaan air berasal dari sumur sendiri (Sumur Bor) Yang Dialirkan', key: 'airSumurDialirkan' },
        { label: 'Pelayanan Pengadaan Air Berasal dari Perusahaan Daerah Air Minum (PDAM)', key: 'airPDAM' },
        { label: 'Pelayanan Pengadaan Air Berasal dari Perusahaan Daerah Air Minum (PDAM) Yang Dialirkan Melalui Pipa Dermaga/TPI', key: 'airPDAMPipaDermaga' },
        { label: 'Pelayanan Pengadaan Air Berasal dari Perusahaan Daerah Air Minum (PDAM) yang dialirkan Melalui Alat Transportasi Lain', key: 'airPDAMTransportLain' },
        { label: 'Pelayanan Pengadaan Air Berasal dari Air Laut-Sea Water Reverse Osmosis (SWRO)', key: 'airSWROLaut' },
        { label: 'Pelayanan Pengadaan Air Berasal dari Air Payau-Brackish Water Reverse Osmosis (SWRO)', key: 'airSWROPayau' },
      ]
    },
    {
      code: 'D', title: 'Pelayanan Bengkel', items: [
        { label: 'Ringan', key: 'bengkelRingan' },
        { label: 'Sedang', key: 'bengkelSedang' },
        { label: 'Berat', key: 'bengkelBerat' },
      ]
    },
    {
      code: 'E', title: 'Pelayanan Penggunaan Kawasan Pelabuhan Perikanan', items: [
        { label: 'Pembuatan Film/Video untuk Komersial Domestik', key: 'filmKomersialDomestik' },
        { label: 'Pembuatan Film/Video untuk Komersial Mancanegara', key: 'filmKomersialMancanegara' },
      ]
    },
    {
      code: 'F', title: 'Pelayanan Pas Masuk', items: [
        { label: 'Pas Harian', key: 'pasHarian' },
        { label: 'Pas Langganan', key: 'pasLangganan' },
      ]
    },
    {
      code: 'G', title: 'Pelayanan Kebersihan', items: [
        { label: 'Kebersihan di Kawasan Pelabuhan', key: 'kebersihanKawasan' },
        { label: 'Kebersihan Kolam Pelabuhan', key: 'kebersihanKolam' },
      ]
    },
    {
      code: 'H', title: 'Pelayanan Instalasi Pengolahan Air Limbah', items: [
        { label: 'Pelayanan Instalasi Pengolahan Air Limbah', key: 'ipal' },
      ]
    },
    {
      code: 'I', title: 'Pelayanan Wisata Bahari Pelabuhan Perikanan', items: [
        { label: 'Pelayanan Wisata Bahari Pelabuhan Perikanan', key: 'wisataBahari' },
      ]
    },
    {
      code: 'J', title: 'Pelayanan Penggunaan Tanah dan/atau Bangunan untuk Kegiatan Perikanan dan Menunjang Kegiatan Perikanan', items: [
        { label: 'Tanah di Kawasan Pelabuhan Perikanan', key: 'tanahKawasan' },
        { label: 'Penjemuran Jaring/Penjemuran Ikan', key: 'tanahPenjemuran' },
        { label: 'Penumpukan Barang', key: 'tanahPenumpukan' },
        { label: 'Bangunan di kawasan pelabuhan perikanan', key: 'bangunanKawasan' },
        { label: 'Ruangan di dalam gedung pemasaran', key: 'ruangGedungPemasaran' },
        { label: 'Asrama', key: 'asrama' },
        { label: 'Ruang Rapat', key: 'ruangRapat' },
        { label: 'Ruang Pertemuan Aula', key: 'ruangPertemuanAula' },
        { label: 'Rumah Susun Nelayan', key: 'rumahSusunNelayan' },
      ]
    },
    {
      code: 'K', title: 'Pelayanan Penggunaan Peralatan dan Mesin', items: [
        { label: 'Pelayanan Pengadaan Es', key: 'peralatanEs' },
        { label: 'Pelayanan Penggunaan Ruang Pendingin, Freezer, dan Cold Storage', key: 'peralatanRuangPendingin' },
        { label: 'Pelayanan Penggunaan Peralatan Tangki BBM dan Air dengan instalasinya', key: 'peralatanTangkiBBM' },
        { label: 'Pelayanan Penggunaan Peralatan Pengembangan Penangkapan Ikan', key: 'peralatanPengembanganPenangkapan' },
        { label: 'Pelayanan penggunaan peralatan pengolahan', key: 'peralatanPengolahan' },
        { label: 'Pelayanan penggunaan peralatan multimedia', key: 'peralatanMultimedia' },
        { label: 'Pelayanan penggunaan peralatan permesinan', key: 'peralatanPermesinan' },
        { label: 'Pelayanan penggunaan transportasi kapal', key: 'transportasiKapal' },
        { label: 'Pelayanan penggunaan transportasi kendaraan/pengangkutan', key: 'transportasiKendaraan' },
        { label: 'Pelayanan penggunaan transportasi kendaraan Berefrigasi/Berpendingin', key: 'transportasiKendaraanPendingin' },
        { label: 'Pelayanan Kontainer', key: 'peralatanKontainer' },
      ]
    },
  ]), [])

  // State jumlah untuk setiap item
  const initialRows = useMemo(() => {
    const obj = {}
    SECTIONS.forEach(sec => sec.items.forEach(item => { obj[item.key] = 0 }))
    return obj
  }, [SECTIONS])

  const [rows, setRows] = useState(initialRows)
  const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n || 0)
  const parseToInt = (str) => {
    const cleaned = String(str).replace(/[^0-9]/g, '')
    return cleaned ? Number(cleaned) : 0
  }

  const initialDisplay = useMemo(() => {
    const obj = {}
    Object.keys(initialRows).forEach(k => { obj[k] = formatRupiah(initialRows[k] || 0) })
    return obj
  }, [initialRows])
  const [rowDisplay, setRowDisplay] = useState(initialDisplay)

  const handleHeaderChange = (e) => {
    const { name, value } = e.target
    setHeader(prev => ({ ...prev, [name]: value }))
  }

  const handleRowChange = (key, value) => {
    const numVal = parseToInt(value)
    setRows(prev => ({ ...prev, [key]: numVal }))
    setRowDisplay(prev => ({ ...prev, [key]: formatRupiah(numVal) }))
  }

  const totalJumlah = useMemo(() => {
    return Object.values(rows).reduce((acc, n) => acc + (Number(n) || 0), 0)
  }, [rows])

  const isHeaderEmpty = (field) => !header[field]
  const totalJumlahFormatted = useMemo(() => formatRupiah(totalJumlah), [totalJumlah])

  const onAttemptUse = () => {
    if (isHeaderEmpty('pelabuhan') || isHeaderEmpty('tanggalCatat')) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 600)
    }
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <FormHeader
        title="Pendapatan Pelabuhan"
        description="Input pendapatan per pelabuhan dan tanggal, dengan tabel kategori dan jumlah (Rp)."
        rightSlot={(
          <div className={`form-group ${isHeaderEmpty('pelabuhan') ? 'error' : ''} ${isHeaderEmpty('pelabuhan') && doShake ? 'shake' : ''}`} style={{ position: 'relative', margin: 0 }}>
            <label className="form-label" style={{ fontSize: 14, marginBottom: 6 }}>Pelabuhan <span className="required-mark">*</span></label>
            <SmartSelect
              name="pelabuhan"
              value={header.pelabuhan}
              onChange={handleHeaderChange}
              category="pelabuhan"
              baseOptions={PELABUHAN_OPTIONS}
              className="form-select"
              required
              style={{ fontSize: 14 }}
              placeholder="Cari atau pilih pelabuhan..."
            />
          </div>
        )}
        selectedLabel={header.pelabuhan ? 'Pelabuhan Terpilih:' : null}
        selectedValue={header.pelabuhan || null}
      />

      <div className="fasilitas-form" style={{ paddingTop: 0 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className={`form-group ${isHeaderEmpty('tanggalCatat') ? 'error' : ''} ${isHeaderEmpty('tanggalCatat') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Tanggal Catat <span className="required-mark">*</span></label>
            <input type="date" name="tanggalCatat" value={header.tanggalCatat} onChange={handleHeaderChange} className="form-input" required />
          </div>
        </div>

        <div className="form-group full-width" style={{ marginTop: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 64 }}>No</th>
                  <th>Jenis Kegiatan</th>
                  <th style={{ width: 120 }}>Satuan</th>
                  <th style={{ width: 160 }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {SECTIONS.map((sec) => (
                  <React.Fragment key={sec.code}>
                    <tr>
                      <td colSpan={4} style={{ background: '#f3f4f6', fontWeight: 600, color: '#374151' }}>{sec.title}</td>
                    </tr>
                    {sec.items.map((item, idx) => (
                      <tr key={item.key}>
                        <td style={{ color: '#6b7280' }}>{idx + 1}.</td>
                        <td>{item.label}</td>
                        <td>Rp</td>
                        <td>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={rowDisplay[item.key]}
                            onChange={(e) => handleRowChange(item.key, e.target.value)}
                            className="form-input"
                            onBlur={onAttemptUse}
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr>
                  <td colSpan={2} style={{ fontWeight: 600 }}>JUMLAH TOTAL</td>
                  <td style={{ fontWeight: 600 }}>Rp</td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={totalJumlahFormatted}
                      readOnly
                      style={{
                        fontWeight: 800,
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        borderColor: '#93c5fd',
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}