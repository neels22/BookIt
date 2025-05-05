// app/(pages)/booking/page.js
import { Suspense } from 'react'
import BookingPage from './BookingPage'

export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<div>Loading booking page...</div>}>
      <BookingPage />
    </Suspense>
  )
}
