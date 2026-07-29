import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(
      <MemoryRouter>
        <Pagination page={1} pageCount={1} />
      </MemoryRouter>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('marks the current page and shows prev/next', () => {
    render(
      <MemoryRouter>
        <Pagination page={2} pageCount={3} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('2')
    expect(
      screen.getByRole('link', { name: 'Previous page' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next page' })).toBeInTheDocument()
  })
})
