import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ui/ProductCard'
import type { Metadata } from 'next'

interface PageProps {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return {
    title: searchParams.q ? `Search: "${searchParams.q}"` : 'Search Products',
  }
}

async function searchProducts(query: string) {
  if (!query.trim()) return []

  const { data } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${query}%,model_number.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(24)

  return data || []
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || ''
  const results = query ? await searchProducts(query) : []

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="font-mono text-xs text-teal-500 tracking-widest uppercase mb-2">
            Search Results
          </div>
          <h1 className="font-display text-3xl font-800 text-white">
            {query ? (
              <>
                Results for{' '}
                <span className="text-gradient">&quot;{query}&quot;</span>
              </>
            ) : (
              'Search Products'
            )}
          </h1>
          {query && (
            <p className="mt-2 text-slate-400 font-mono text-sm">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {!query && (
          <div className="cyber-card p-16 text-center">
            <div className="font-mono text-teal-500/50 text-4xl mb-4">🔍</div>
            <p className="text-slate-400">Use the search bar above to find products by name or model number</p>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="cyber-card p-16 text-center">
            <div className="font-mono text-teal-500/50 text-4xl mb-4">( )</div>
            <h3 className="font-display font-700 text-white text-xl mb-2">No results for &quot;{query}&quot;</h3>
            <p className="text-slate-400 mb-6">Try searching by model number (e.g. DS-2CD2143G2-I) or product name</p>
            <a href="tel:+233555517658" className="btn-primary inline-block">
              📞 Call us for availability
            </a>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
