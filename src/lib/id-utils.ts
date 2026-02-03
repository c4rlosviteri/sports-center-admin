/**
 * Validates an Ecuadorian cédula de identidad
 * Uses the modulo 10 algorithm with province and type digit validation
 */
export function validateEcuadorianCedula(cedula: string): boolean {
  // Remove any non-digit characters
  const cleaned = cedula.replace(/\D/g, '')

  // Must be exactly 10 digits
  if (cleaned.length !== 10) {
    return false
  }

  // First two digits must be valid province code (01-24)
  const provinceCode = Number.parseInt(cleaned.substring(0, 2), 10)
  if (provinceCode < 1 || provinceCode > 24) {
    return false
  }

  // Third digit must be less than 6 (for natural persons)
  const thirdDigit = Number.parseInt(cleaned.charAt(2), 10)
  if (thirdDigit >= 6) {
    return false
  }

  // Calculate check digit using modulo 10 algorithm
  const digits = cleaned.split('').map(Number)
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2]

  let sum = 0
  for (let i = 0; i < 9; i++) {
    let product = digits[i] * coefficients[i]
    if (product >= 10) {
      product -= 9
    }
    sum += product
  }

  const calculatedCheckDigit = (10 - (sum % 10)) % 10
  const providedCheckDigit = digits[9]

  return calculatedCheckDigit === providedCheckDigit
}
