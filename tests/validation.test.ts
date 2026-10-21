import test from 'node:test'
import assert from 'node:assert'
import { z } from 'zod'

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  address: z.string().min(10, 'Please enter your full delivery address'),
  landmark: z.string().optional(),
  instructions: z.string().optional(),
  orderType: z.enum(['delivery', 'pickup']),
})

test('Checkout validation accepts valid delivery order', () => {
  const validData = {
    customerName: 'Muhammad Ali',
    phone: '03001234567',
    address: 'House 12, Street 4, Sector G-9, Islamabad',
    landmark: 'Near Standard Chartered',
    instructions: 'Ring doorbell twice',
    orderType: 'delivery' as const,
  }
  const result = checkoutSchema.safeParse(validData)
  assert.ok(result.success)
})

test('Checkout validation rejects short name', () => {
  const invalidData = {
    customerName: 'M',
    phone: '03001234567',
    address: 'House 12, Street 4, Sector G-9, Islamabad',
    orderType: 'delivery' as const,
  }
  const result = checkoutSchema.safeParse(invalidData)
  assert.ok(!result.success)
})

test('Checkout validation rejects invalid phone numbers', () => {
  const tooShort = {
    customerName: 'Ali Khan',
    phone: '12345',
    address: 'House 12, Street 4, Sector G-9, Islamabad',
    orderType: 'delivery' as const,
  }
  assert.ok(!checkoutSchema.safeParse(tooShort).success)

  const tooLong = {
    customerName: 'Ali Khan',
    phone: '12345678901234567890',
    address: 'House 12, Street 4, Sector G-9, Islamabad',
    orderType: 'delivery' as const,
  }
  assert.ok(!checkoutSchema.safeParse(tooLong).success)
})

test('Checkout validation handles pickup orders without landmark/instructions', () => {
  const pickupData = {
    customerName: 'Farhan Zaidi',
    phone: '03219876543',
    address: 'Takeaway counter',
    orderType: 'pickup' as const,
  }
  assert.ok(checkoutSchema.safeParse(pickupData).success)
})
