'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProductPage(folderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.from('product_pages').insert({
    user_id: user.id,
    folder_id: folderId,
    title: 'Nouvelle Annonce',
    status: 'draft'
  }).select().single()

  if (error) throw new Error(error.message)
  
  revalidatePath(`/dashboard/folders/${folderId}`)
  return data
}

export async function updateProductPage(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_pages')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/products/${id}`)
  return data
}

export async function deleteProductPage(id: string, folderId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('product_pages')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/folders/${folderId}`)
}
