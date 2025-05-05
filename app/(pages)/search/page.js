// app/(pages)/search/page.js
import { Suspense } from 'react'
import SearchPage from './SearchPage'

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPage />
    </Suspense>
  )
}
