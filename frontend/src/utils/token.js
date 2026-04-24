export function generateToken(counter) {
  return 'T-' + String(counter).padStart(3, '0')
}
