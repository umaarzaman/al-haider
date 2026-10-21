import test from 'node:test'
import assert from 'node:assert'

interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  variantLabel: string
  price: number
  quantity: number
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

function updateItemQuantity(items: CartItem[], id: string, newQty: number): CartItem[] {
  if (newQty <= 0) {
    return items.filter(item => item.id !== id)
  }
  return items.map(item => item.id === id ? { ...item, quantity: newQty } : item)
}

test('Cart calculations: subtotal and totalItems', () => {
  const items: CartItem[] = [
    {
      id: 'pizza-ah-special-md',
      productId: 'pizza-ah-special',
      variantId: 'pizza-ah-special-md',
      name: 'AH Special Pizza',
      variantLabel: 'Medium',
      price: 1200,
      quantity: 2,
    },
    {
      id: 'burger-zinger-reg',
      productId: 'burger-zinger',
      variantId: 'burger-zinger-reg',
      name: 'Zinger Burger',
      variantLabel: 'Regular',
      price: 350,
      quantity: 1,
    },
    {
      id: 'wings-bbq-10',
      productId: 'wings-bbq',
      variantId: 'wings-bbq-10',
      name: 'BBQ Wings',
      variantLabel: '10 Pieces',
      price: 700,
      quantity: 1,
    },
  ]

  assert.strictEqual(calculateTotalItems(items), 4)
  assert.strictEqual(calculateSubtotal(items), 1200 * 2 + 350 * 1 + 700 * 1) // 3450
})

test('Cart item quantity update and removal on 0', () => {
  const initialItems: CartItem[] = [
    {
      id: 'pizza-kabab-lg',
      productId: 'pizza-kabab',
      variantId: 'pizza-kabab-lg',
      name: 'Kabab Crust Pizza',
      variantLabel: 'Large',
      price: 1550,
      quantity: 2,
    },
  ]

  // Increase quantity to 3
  const updated1 = updateItemQuantity(initialItems, 'pizza-kabab-lg', 3)
  assert.strictEqual(updated1[0].quantity, 3)
  assert.strictEqual(calculateSubtotal(updated1), 1550 * 3)

  // Decrease quantity to 0 removes the item
  const updated2 = updateItemQuantity(updated1, 'pizza-kabab-lg', 0)
  assert.strictEqual(updated2.length, 0)
  assert.strictEqual(calculateSubtotal(updated2), 0)
})
