import { Suspense } from 'react'
import OrderClient from './OrderClient'

export const dynamic = 'force-dynamic'

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading order form...</div>}>
      <OrderClient />
    </Suspense>
  )
}
