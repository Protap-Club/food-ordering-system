export function calculateBill(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const cgst = Math.round(subtotal * 0.025)
  const sgst = Math.round(subtotal * 0.025)
  const gst = cgst + sgst
  const total = subtotal + gst
  return { subtotal, cgst, sgst, gst, total }
}

export function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}
