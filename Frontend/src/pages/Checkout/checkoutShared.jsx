import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveImageUrl } from '../../utils/image'

export const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

export const createAddressForm = (user) => ({
  customerName: user?.name || '',
  contactNumber: user?.contactNumber || '',
  addressLine1: user?.addressLine1 || '',
  addressLine2: user?.addressLine2 || '',
  city: user?.city || '',
  state: user?.state || '',
  postalCode: user?.postalCode || '',
  country: user?.country || 'India'
})

export const createPaymentForm = () => ({
  paymentMethod: 'bank_transfer',
  accountHolder: '',
  accountNumber: '',
  ifscCode: '',
  upiId: ''
})

export const buildDraftKey = (mode, productId) => `limeStreet:checkout:${mode}:${productId || 'cart'}`

export const readCheckoutDraft = (key) => {
  try {
    const rawValue = window.sessionStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : null
  } catch (error) {
    console.error('Unable to read checkout draft:', error)
    return null
  }
}

export const writeCheckoutDraft = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export const clearCheckoutDraft = (key) => {
  window.sessionStorage.removeItem(key)
}

export const checkoutSteps = [
  { id: 1, label: 'Login' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Payment' }
]

export const SummaryItems = ({ items }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.id} className="flex gap-3 border-b border-white/8 pb-4 last:border-b-0">
        <img
          src={resolveImageUrl(item.productImage) || PRODUCT_IMAGE_FALLBACK_SRC}
          alt={item.productName}
          className="h-20 w-16 rounded-xl object-cover"
          onError={handleProductImageError}
        />
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium text-white">{item.productName}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Qty {item.quantity} • {item.selectedSize || 'Default size'} {item.selectedColor ? `• ${item.selectedColor}` : ''}
          </p>
          <p className="mt-2 text-sm text-zinc-300">{formatPrice(item.totalPrice)}</p>
        </div>
      </div>
    ))}
  </div>
)
