// Utility helpers to standardize form validation across pages

export const isEmpty = (val) => val === undefined || val === null || val === ''

// Create a reusable validator given required and numeric keys
export const createIsRequiredEmpty = (formData, {
  textKeys = [],
  numericKeys = [],
} = {}) => {
  return (key) => {
    if (textKeys.includes(key)) {
      return isEmpty(formData[key])
    }
    if (numericKeys.includes(key)) {
      return isEmpty(formData[key]) && formData[key] !== 0
    }
    return false
  }
}

// Compute disabled state for save button
export const createIsSaveDisabled = (isRequiredEmpty, keys = []) => (
  keys.some(isRequiredEmpty)
)