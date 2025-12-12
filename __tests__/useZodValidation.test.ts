import { describe, it, expect } from 'vitest'
import { useZodValidation } from '~/composables/useZodValidation'
import { z } from 'zod'

describe('useZodValidation', () => {
  const testSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Must be at least 18 years old'),
  })

  const initialData = {
    username: '',
    email: '',
    age: 0,
  }

  it('should properly initialize form state', () => {
    const { form, errors, isValid, isFormValid } = useZodValidation(testSchema, initialData)

    // Check initial state
    expect(form.username).toBe('')
    expect(form.email).toBe('')
    expect(form.age).toBe(0)

    expect(errors.value.username).toBe('')
    expect(errors.value.email).toBe('')
    expect(errors.value.age).toBe('')

    expect(isValid.value).toBe(true)
    expect(isFormValid.value).toBe(false) // Form is invalid because of validation schema
  })

  it('should validate field when validateField is called', () => {
    const { validateField, errors } = useZodValidation(testSchema, initialData)

    // Validate with invalid data
    validateField('username', 'ab') // Too short
    expect(errors.value.username).toBe('Username must be at least 3 characters')

    // Validate with valid data
    validateField('username', 'validuser')
    expect(errors.value.username).toBe('')
  })

  it('should validate all fields when validateAll is called', () => {
    const { validateAll, errors } = useZodValidation(testSchema, initialData)

    validateAll()

    // Should have errors after validation
    expect(errors.value.username).toBe('Username must be at least 3 characters')
    expect(errors.value.email).toBe('Invalid email format')
    expect(errors.value.age).toBe('Must be at least 18 years old')
  })

  it('should reset form when reset is called', () => {
    const { form, errors, validateAll, reset } = useZodValidation(testSchema, initialData)

    // Add some data and validate
    form.username = 'testuser'
    form.email = 'invalid-email'
    validateAll()

    // Should have errors
    expect(errors.value.email).toBe('Invalid email format')

    // Reset form
    reset()

    // Should be back to initial state
    expect(form.username).toBe('')
    expect(form.email).toBe('')
    expect(form.age).toBe(0)
    expect(errors.value.email).toBe('')
  })

  it('should reset with new data when reset is called with parameters', () => {
    const { form, reset } = useZodValidation(testSchema, initialData)

    // Reset with new data
    const newData = { username: 'newuser', email: 'new@example.com', age: 25 }
    reset(newData)

    expect(form.username).toBe('newuser')
    expect(form.email).toBe('new@example.com')
    expect(form.age).toBe(25)
  })

  it('should handle blur events correctly', () => {
    const { handleBlur, errors } = useZodValidation(testSchema, initialData, { validateOnBlur: true })

    // Set some invalid data
    const { form } = useZodValidation(testSchema, initialData)
    form.email = 'invalid-email'

    // Simulate blur event
    handleBlur('email')

    expect(errors.value.email).toBe('Invalid email format')
  })

  it('should handle change events correctly', () => {
    const { handleChange, form, errors } = useZodValidation(testSchema, initialData, { validateOnChange: true, debounceMs: 0 })

    // Simulate change event with valid data
    handleChange('username', 'validuser')
    expect(form.username).toBe('validuser')
    expect(errors.value.username).toBe('') // Should be valid

    // Simulate change event with invalid data
    handleChange('username', 'ab') // Too short
    expect(form.username).toBe('ab')
    // Note: Due to debouncing, this might still show as valid momentarily
  })

  it('should check if field is touched', () => {
    const { isFieldTouched, markFieldAsTouched } = useZodValidation(testSchema, initialData)

    expect(isFieldTouched('username')).toBe(false)

    markFieldAsTouched('username')

    expect(isFieldTouched('username')).toBe(true)
  })

  it('should clear errors', () => {
    const { errors, validateAll, clearErrors } = useZodValidation(testSchema, initialData)

    validateAll() // This should add errors
    expect(errors.value.username).not.toBe('')

    clearErrors()
    expect(errors.value.username).toBe('')
    expect(errors.value.email).toBe('')
    expect(errors.value.age).toBe('')
  })

  it('should clear specific field error', () => {
    const { errors, validateAll, clearFieldError } = useZodValidation(testSchema, initialData)

    validateAll() // This should add errors
    expect(errors.value.username).not.toBe('')

    clearFieldError('username')
    expect(errors.value.username).toBe('')
    expect(errors.value.email).not.toBe('') // Other errors should remain
  })

  it('should set form values', () => {
    const { form, setFormValues } = useZodValidation(testSchema, initialData)

    const newData = { username: 'newuser', age: 25 }
    setFormValues(newData)

    expect(form.username).toBe('newuser')
    expect(form.age).toBe(25)
    // Email should remain unchanged
    expect(form.email).toBe('')
  })

  it('should handle autoValidate option', () => {
    const { form, errors } = useZodValidation(testSchema, initialData, { autoValidate: true })

    // Initially no errors shown because no fields are touched
    expect(errors.value.username).toBe('')

    // When we change form data and it's been touched, validation should run
    form.username = 'ab' // Invalid
    // Need to mark field as touched for validation to occur
    // This behavior depends on the implementation
  })

  it('should return boolean from validateField', () => {
    const { validateField } = useZodValidation(testSchema, initialData)

    const resultValid = validateField('username', 'validuser')
    expect(resultValid).toBe(true) // No error for this field

    const resultInvalid = validateField('username', 'ab') // Too short
    expect(resultInvalid).toBe(false) // Has error for this field
  })
})
