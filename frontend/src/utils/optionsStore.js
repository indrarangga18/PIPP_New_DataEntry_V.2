// Simple localStorage-backed options store to support dynamic dropdown growth
// Categories example: 'pelabuhan', 'sumberDana', 'jenisKonstruksi', 'jenisFasilitasUmum', 'kondisi'

const STORAGE_KEY = 'pipp_options_store'
const HIDDEN_KEY = '__hidden__'

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

const writeStore = (store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (e) {
    // ignore write errors (e.g., storage full)
  }
}

export const getOptions = (category, baseOptions = []) => {
  const merged = getAllOptions(category, baseOptions)
  const hiddenList = getHiddenList(category)
  const hiddenSet = new Set(hiddenList)
  return merged.filter(v => !hiddenSet.has(v))
}

export const addOption = (category, value) => {
  if (!value) return
  const trimmed = String(value).trim()
  if (!trimmed) return
  const store = readStore()
  const current = Array.isArray(store[category]) ? store[category] : []
  if (!current.includes(trimmed)) {
    store[category] = [...current, trimmed]
    writeStore(store)
  }
}

export const hasOption = (category, value, baseOptions = []) => {
  const merged = getOptions(category, baseOptions)
  return merged.includes(String(value))
}

export const OTHER_LABEL = 'Lainnya'

// CRUD helpers for Master Data management
export const setOptions = (category, list = []) => {
  const normalized = Array.from(new Set((list || []).map(v => String(v).trim()).filter(Boolean)))
  const store = readStore()
  store[category] = normalized
  writeStore(store)
}

export const removeOption = (category, value) => {
  const target = String(value).trim()
  const store = readStore()
  const current = Array.isArray(store[category]) ? store[category] : []
  const next = current.filter(v => v !== target)
  store[category] = next
  writeStore(store)
}

export const updateOption = (category, oldValue, newValue) => {
  const oldV = String(oldValue).trim()
  const newV = String(newValue).trim()
  if (!newV) return
  const store = readStore()
  const current = Array.isArray(store[category]) ? store[category] : []
  const idx = current.indexOf(oldV)
  if (idx >= 0) {
    const next = [...current]
    next[idx] = newV
    store[category] = Array.from(new Set(next))
    writeStore(store)
  }
}

export const clearCategory = (category) => {
  const store = readStore()
  delete store[category]
  writeStore(store)
}

// Visibility management (show/hide)
const readHidden = () => {
  const store = readStore()
  const hidden = store[HIDDEN_KEY]
  if (hidden && typeof hidden === 'object') return hidden
  return {}
}

const writeHidden = (hidden) => {
  const store = readStore()
  store[HIDDEN_KEY] = hidden
  writeStore(store)
}

export const getHiddenList = (category) => {
  const hidden = readHidden()
  const list = hidden[category]
  return Array.isArray(list) ? list : []
}

export const isHidden = (category, value) => {
  const target = String(value).trim()
  if (!target) return false
  const list = getHiddenList(category)
  return list.includes(target)
}

export const setHidden = (category, value, flag) => {
  const target = String(value).trim()
  const hidden = readHidden()
  const list = Array.isArray(hidden[category]) ? hidden[category] : []
  const set = new Set(list)
  if (flag) {
    set.add(target)
  } else {
    set.delete(target)
  }
  hidden[category] = Array.from(set)
  writeHidden(hidden)
}

export const toggleHidden = (category, value) => {
  const next = !isHidden(category, value)
  setHidden(category, value, next)
}

// Get all options including hidden (for Master Data table)
export const getAllOptions = (category, baseOptions = []) => {
  const store = readStore()
  const userOptions = Array.isArray(store[category]) ? store[category] : []
  return Array.from(new Set([...(baseOptions || []), ...userOptions]))
}