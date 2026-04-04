import { supabase } from '@/lib/supabase'

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  sort_order: number
  children?: Category[]
}

// Fetch all categories flat
export async function getAllCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  return data || []
}

// Build nested tree from flat list
export function buildTree(categories: Category[]): Category[] {
  const map: Record<string, Category> = {}
  const roots: Category[] = []

  categories.forEach(c => { map[c.id] = { ...c, children: [] } })
  categories.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children!.push(map[c.id])
    } else if (!c.parent_id) {
      roots.push(map[c.id])
    }
  })
  return roots
}

// Get flat categories with a given parent_id
export function getChildren(categories: Category[], parentId: string | null): Category[] {
  return categories.filter(c => c.parent_id === parentId)
}