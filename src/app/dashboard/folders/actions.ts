'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getFolders(type: 'annonce' | 'etude' = 'annonce') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching folders:', error)
    return []
  }
  
  // Fallback for V1 folders (no prefix)
  const isV1Folder = (name: string) => !name.startsWith('[a]') && !name.startsWith('[e]')
  const prefix = type === 'annonce' ? '[a]' : '[e]'

  const filtered = data.filter((f) => {
    if (type === 'annonce') return f.name.startsWith('[a]') || isV1Folder(f.name)
    return f.name.startsWith('[e]')
  })

  // Normalize names for the UI
  return filtered.map(f => ({
    ...f,
    type,
    name: f.name.startsWith('[a]') || f.name.startsWith('[e]') ? f.name.substring(3) : f.name
  }))
}

export async function createFolder(name: string, type: 'annonce' | 'etude', parentId: string | null = null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const prefix = type === 'annonce' ? '[a]' : '[e]'
  const dbName = `${prefix}${name}`

  const { data, error } = await supabase.from('folders').insert({
    name: dbName,
    parent_id: parentId,
    user_id: user.id
  }).select().single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  return { data }
}

export async function renameFolder(id: string, newName: string, type: 'annonce' | 'etude') {
  const supabase = await createClient()

  const prefix = type === 'annonce' ? '[a]' : '[e]'
  const dbName = `${prefix}${newName}`

  const { data, error } = await supabase
    .from('folders')
    .update({ name: dbName })
    .eq('id', id)
    .select()

  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  return { data }
}

export async function deleteFolder(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  return { success: true }
}
