import React, { useState } from 'react'
import '../../styles/fasilitas-form.css'
import AutoBreadcrumb from '../../components/AutoBreadcrumb'
import FormHeader from '../../components/FormHeader'
import SmartSelect from '../../components/SmartSelect'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../../utils/formValidation'
import { PELABUHAN_OPTIONS, INDUSTRI_OPTIONS, JENIS_BADAN_USAHA_OPTIONS } from '../../utils/formStandards'

export default function IndustriPelabuhan() {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    tanggalCatat: '',
    jenisBadanUsaha: '',
    namaIndustri: '',
    jenisUsaha: '',
    namaPemilik: '',
    nomorTelepon: '',
    alamat: '',
    nilaiInvestasiProdusen: '',
    luasLahanSewaM2: '',
    jumlahTenagaKerja: '',
    aktif: false,
  })
  const [doShake, setDoShake] = useState(false)

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan', 'tanggalCatat'],
    numericKeys: [],
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan', 'tanggalCatat']) || !formData.aktif

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'number') {
      const numVal = value === '' ? '' : Number(value)
      setFormData(prev => ({ ...prev, [name]: numVal }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: e.target.checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const onSave = () => {
    if (saveDisabled) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 600)
      return
    }
    // TODO: Integrasi ke API backend
    console.log('Simpan Industri di Pelabuhan:', formData)
    alert('Data Industri di Pelabuhan siap disimpan (mock).')
  }

  const onReset = () => {
    setFormData({
      pelabuhan: '',
      tanggalCatat: '',
      jenisBadanUsaha: '',
      namaIndustri: '',
      jenisUsaha: '',
      namaPemilik: '',
      nomorTelepon: '',
      alamat: '',
      nilaiInvestasiProdusen: '',
      luasLahanSewaM2: '',
      jumlahTenagaKerja: '',
      aktif: false,
    })
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <FormHeader
        title="Industri di Pelabuhan"
        description="Form data industri dan usaha di pelabuhan"
        rightSlot={(
          <div className={`form-group ${isRequiredEmpty('pelabuhan') ? 'error' : ''} ${isRequiredEmpty('pelabuhan') && doShake ? 'shake' : ''}`} style={{ position: 'relative', margin: 0 }}>
            <label className="form-label" style={{ fontSize: 14, marginBottom: 6 }}>Pelabuhan <span className="required-mark">*</span></label>
            <SmartSelect
              name="pelabuhan"
              value={formData.pelabuhan}
              onChange={handleInputChange}
              category="pelabuhan"
              baseOptions={PELABUHAN_OPTIONS}
              className="form-select"
              required
              style={{ fontSize: 14 }}
              placeholder="Cari atau pilih pelabuhan..."
            />
          </div>
        )}
        selectedLabel={formData.pelabuhan ? 'Pelabuhan Terpilih:' : null}
        selectedValue={formData.pelabuhan || null}
      />

      <form className="fasilitas-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          {/* Tanggal Catat */}
          <div className={`form-group ${isRequiredEmpty('tanggalCatat') ? 'error' : ''} ${isRequiredEmpty('tanggalCatat') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Tanggal Catat <span className="required-mark">*</span></label>
            <input type="date" name="tanggalCatat" value={formData.tanggalCatat} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Jenis Badan Usaha */}
          <div className="form-group">
            <label className="form-label">Jenis Badan Usaha</label>
            <SmartSelect
              name="jenisBadanUsaha"
              value={formData.jenisBadanUsaha}
              onChange={handleInputChange}
              category="jenisBadanUsaha"
              baseOptions={JENIS_BADAN_USAHA_OPTIONS}
              className="form-select"
              placeholder="Pilih jenis badan usaha..."
            />
          </div>

          {/* Nama Industri */}
          <div className="form-group">
            <label className="form-label">Nama Industri</label>
            <input type="text" name="namaIndustri" value={formData.namaIndustri} onChange={handleInputChange} className="form-input" placeholder="Nama industri" />
          </div>

          {/* Jenis Usaha (mengacu Master Data Industri) */}
          <div className="form-group">
            <label className="form-label">Jenis Usaha</label>
            <SmartSelect
              name="jenisUsaha"
              value={formData.jenisUsaha}
              onChange={handleInputChange}
              category="industri"
              baseOptions={INDUSTRI_OPTIONS}
              className="form-select"
              placeholder="Pilih jenis usaha..."
            />
          </div>

          {/* Nama Pemilik */}
          <div className="form-group">
            <label className="form-label">Nama Pemilik</label>
            <input type="text" name="namaPemilik" value={formData.namaPemilik} onChange={handleInputChange} className="form-input" placeholder="Nama pemilik" />
          </div>

          {/* Nomor Telepon */}
          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input type="text" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleInputChange} className="form-input" placeholder="No. Telepon/HP" />
          </div>

          {/* Alamat */}
          <div className="form-group full-width">
            <label className="form-label">Alamat</label>
            <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} className="form-input" rows={3} placeholder="Alamat lengkap" />
          </div>

          {/* Nilai Investasi Produsen */}
          <div className="form-group">
            <label className="form-label">Nilai Investasi Produsen</label>
            <input type="number" name="nilaiInvestasiProdusen" value={formData.nilaiInvestasiProdusen} onChange={handleInputChange} className="form-input" min="0" step="1" placeholder="0" />
          </div>

          {/* Luas lahan yang disewa M2 */}
          <div className="form-group">
            <label className="form-label">Luas lahan yang disewa (M2)</label>
            <input type="number" name="luasLahanSewaM2" value={formData.luasLahanSewaM2} onChange={handleInputChange} className="form-input" min="0" step="0.01" placeholder="0" />
          </div>

          {/* Jumlah Tenaga Kerja */}
          <div className="form-group">
            <label className="form-label">Jumlah Tenaga Kerja</label>
            <input type="number" name="jumlahTenagaKerja" value={formData.jumlahTenagaKerja} onChange={handleInputChange} className="form-input" min="0" step="1" placeholder="0" />
          </div>

          {/* Aktif (required) */}
          <div className={`form-group ${!formData.aktif ? 'error' : ''} ${!formData.aktif && doShake ? 'shake' : ''}`}>
            <label className="form-label">Aktif <span className="required-mark">*</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" name="aktif" checked={formData.aktif} onChange={handleInputChange} />
              <span style={{ fontSize: 12, color: '#6b7280' }}>Centang jika industri aktif</span>
            </div>
          </div>

          {/* Aksi */}
          <div className="form-actions full-width">
            <button type="button" className="btn btn-primary" disabled={saveDisabled} onClick={onSave}>Simpan Data</button>
            <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
          </div>
        </div>
      </form>
    </div>
  )
}