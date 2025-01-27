import { useState, useCallback } from 'react'

export function useForm({ initialValues, validate }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = useCallback((field, value, allValues = values) => {
    if (validate && validate[field]) {
      const error = validate[field](value, allValues)
      setErrors(prev => ({
        ...prev,
        [field]: error
      }))
      return !error
    }
    return true
  }, [validate, values])

  const validateAll = useCallback(() => {
    if (!validate) return true

    const newErrors = {}
    let isValid = true

    Object.keys(validate).forEach(field => {
      const error = validate[field](values[field], values)
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validate, values])

  const getInputProps = useCallback((field) => ({
    value: values[field] || '',
    onChange: (e) => {
      const value = e.target?.value
      setValues(prev => ({
        ...prev,
        [field]: value
      }))
      if (touched[field]) {
        validateField(field, value)
      }
    },
    onBlur: () => {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }))
      validateField(field, values[field])
    }
  }), [values, touched, validateField])

  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))
    if (touched[field]) {
      validateField(field, value)
    }
  }, [touched, validateField])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    getInputProps,
    setFieldValue,
    validate: validateAll,
    validateField,
    reset
  }
}
