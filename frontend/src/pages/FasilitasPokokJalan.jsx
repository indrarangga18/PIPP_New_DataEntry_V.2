import React, { useState } from 'react'
import '../styles/fasilitas-form.css'

const FasilitasPokokJalan = () => {
  const [formData, setFormData] = useState({
    namaJalan: '',
    panjang: '',
    lebar: '',
    tanggalPembuatan: '',
    keteranganKonstruksi: '',
    gambar: null,
    aktif: true
  })

  const [imagePreview, setImagePreview] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, gambar: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // Di sini akan ditambahkan logika untuk mengirim data ke API
  }

  const handleReset = () => {
    setFormData({
      namaJalan: '',
      panjang: '',
      lebar: '',
      tanggalPembuatan: '',
      keteranganKonstruksi: '',
      gambar: null,
      aktif: true
    })
    setImagePreview(null)
  }

  return (
    <>
      <div style={{position:'fixed', top:'78px', left:'220px', zIndex:9999, background:'rgba(34,197,94,0.15)', color:'#065f46', padding:'4px 8px', borderRadius:'6px'}}>Jalan form mounted</div>
    <div className="section-card">
      <h1 className="section-title">Fasilitas Pokok - Jalan</h1>
      <p className="section-desc">Form untuk mengelola data fasilitas pokok jalan</p>
      
      <form className="fasilitas-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Nama Jalan
              <span className="tooltip-trigger" title="Masukkan nama lengkap jalan sesuai dengan penamaan resmi">
                ❗
              </span>
            </label>
            <input
              type="text"
              name="namaJalan"
              value={formData.namaJalan}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: Jalan Utama Pelabuhan"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Panjang (meter)
              <span className="tooltip-trigger" title="Masukkan panjang jalan dalam satuan meter, gunakan angka desimal jika diperlukan">
                ❗
              </span>
            </label>
            <input
              type="number"
              name="panjang"
              value={formData.panjang}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: 500"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Lebar (meter)
              <span className="tooltip-trigger" title="Masukkan lebar jalan dalam satuan meter, gunakan angka desimal jika diperlukan">
                ❗
              </span>
            </label>
            <input
              type="number"
              name="lebar"
              value={formData.lebar}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: 8"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Tanggal Pembuatan
              <span className="tooltip-trigger" title="Pilih tanggal pembuatan jalan, bisa menggunakan kalender atau input manual">
                ❗
              </span>
            </label>
            <input
              type="date"
              name="tanggalPembuatan"
              value={formData.tanggalPembuatan}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Keterangan Konstruksi
              <span className="tooltip-trigger" title="Pilih jenis konstruksi jalan yang sesuai dengan kondisi aktual">
                ❗
              </span>
            </label>
            <select
              name="keteranganKonstruksi"
              value={formData.keteranganKonstruksi}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Pilih Keterangan Konstruksi</option>
              <option value="Aspal">Aspal</option>
              <option value="Beton">Beton</option>
              <option value="Paving Block">Paving Block</option>
              <option value="Tanah">Tanah</option>
              <option value="Kerikil">Kerikil</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label className="form-label">
              Upload Gambar
              <span className="tooltip-trigger" title="Upload foto jalan dalam format JPG, PNG, atau GIF maksimal 5MB">
                ❗
              </span>
            </label>
            <input
              type="file"
              name="gambar"
              onChange={handleImageChange}
              className="form-input file-input"
              accept="image/*"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Status
              <span className="tooltip-trigger" title="Aktifkan jika jalan masih beroperasi, nonaktifkan jika sudah tidak digunakan">
                ❗
              </span>
            </label>
            <div className="switch-container">
              <label className="switch">
                <input
                  type="checkbox"
                  name="aktif"
                  checked={formData.aktif}
                  onChange={handleInputChange}
                />
                <span className="slider"></span>
              </label>
              <span className="switch-label">
                {formData.aktif ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Simpan Data
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset Form
          </button>
        </div>
      </form>
    </div>
    </>
  )
}

export default FasilitasPokokJalan