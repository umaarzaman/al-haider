import test from 'node:test'
import assert from 'node:assert'
import { CATEGORIES, PRODUCTS, FEATURED_PRODUCTS } from '../src/data/menu.ts'

test('Menu categories integrity', () => {
  assert.ok(CATEGORIES.length >= 10, 'Should have at least 10 categories')
  
  const categoryIds = new Set(CATEGORIES.map(c => c.id))
  assert.strictEqual(categoryIds.size, CATEGORIES.length, 'All category IDs must be unique')
  
  // Verify mandatory categories from business requirement
  const requiredCategories = ['pizza', 'burger', 'fries', 'sandwich', 'wings', 'pasta', 'wrap', 'broast', 'soup', 'drinks']
  for (const req of requiredCategories) {
    assert.ok(categoryIds.has(req), `Category ${req} must exist`)
  }
})

test('Menu products integrity', () => {
  assert.ok(PRODUCTS.length > 30, 'Should have a rich product catalog')
  
  const categoryIds = new Set(CATEGORIES.map(c => c.id))
  const productIds = new Set<string>()

  for (const product of PRODUCTS) {
    assert.ok(!productIds.has(product.id), `Duplicate product ID: ${product.id}`)
    productIds.add(product.id)

    assert.ok(categoryIds.has(product.category), `Product ${product.id} has invalid category ${product.category}`)
    assert.ok(product.name.trim().length > 0, `Product ${product.id} must have a name`)
    assert.ok(product.variants.length > 0, `Product ${product.id} must have at least one variant`)

    for (const variant of product.variants) {
      assert.ok(variant.id.length > 0, `Variant in ${product.id} must have an ID`)
      assert.ok(variant.label.length > 0, `Variant in ${product.id} must have a label`)
      assert.ok(variant.price >= 0, `Variant in ${product.id} must have a non-negative price`)
    }
  }
})

test('Featured products exist in product catalog', () => {
  const productIds = new Set(PRODUCTS.map(p => p.id))
  for (const id of FEATURED_PRODUCTS) {
    assert.ok(productIds.has(id), `Featured product ${id} does not exist in catalog`)
  }
})
