import { describe, it, expect } from 'vitest'
import { slugify } from './slug'

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
  it('strips punctuation and collapses separators', () => {
    expect(slugify('Hello,   World!!')).toBe('hello-world')
  })
  it('trims leading/trailing hyphens', () => {
    expect(slugify('--Foo Bar--')).toBe('foo-bar')
  })
  it('caps length at 80 chars', () => {
    expect(slugify('a'.repeat(200)).length).toBe(80)
  })
})
