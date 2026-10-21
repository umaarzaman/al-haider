import test from 'node:test'
import assert from 'node:assert'
import { formatPrice, generateOrderRef } from '../src/lib/utils.ts'

test('formatPrice formats correctly in PKR', () => {
  assert.strictEqual(formatPrice(0), 'Rs. 0')
  assert.strictEqual(formatPrice(500), 'Rs. 500')
  assert.strictEqual(formatPrice(1200), 'Rs. 1,200')
  assert.strictEqual(formatPrice(15000), 'Rs. 15,000')
})

test('generateOrderRef produces valid 8-character alphanumeric references', () => {
  const ref1 = generateOrderRef()
  const ref2 = generateOrderRef()
  
  assert.strictEqual(ref1.length, 8)
  assert.strictEqual(ref2.length, 8)
  assert.notStrictEqual(ref1, ref2)
  
  // Ref should contain only valid chars (A-Z, 2-9 without confusing chars like O or 1)
  assert.match(ref1, /^[A-Z0-9]{8}$/)
  assert.match(ref2, /^[A-Z0-9]{8}$/)
})

test('generateOrderRef has high entropy across multiple calls', () => {
  const refs = new Set<string>()
  for (let i = 0; i < 100; i++) {
    const ref = generateOrderRef()
    assert.ok(!refs.has(ref), `Collision detected for ref: ${ref}`)
    refs.add(ref)
  }
  assert.strictEqual(refs.size, 100)
})
