'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMarketResearchPage(folderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.from('market_research_pages').insert({
    user_id: user.id,
    folder_id: folderId,
    title: 'Nouvelle recherche'
  }).select().single()

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/folders/${folderId}`)
  return data
}

export async function updateMarketResearchPage(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('market_research_pages')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/market-research/${id}`)
  return data
}

export async function deleteMarketResearchPage(id: string, folderId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('market_research_pages')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/folders/${folderId}`)
}

export async function saveImageRecord(pageId: string, url: string, type: 'product' | 'research') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.from('images').insert({
    user_id: user.id,
    page_id: pageId,
    type,
    url
  }).select().single()

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/market-research/${pageId}`)
  return data
}
