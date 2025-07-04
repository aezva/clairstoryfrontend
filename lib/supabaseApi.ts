import { supabase } from './supabaseClient'

// Obtener usuario actual
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

// PROYECTOS
export async function getProjects() {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createProject({ title, description }) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, description, user_id: user.id }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateProject(id, fields) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('projects')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteProject(id) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

// CAPÍTULOS
export async function getChapters(project_id) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_id', project_id)
    .order('order_num', { ascending: true })
  if (error) throw error
  return data
}

export async function createChapter({ project_id, title, content, order_num }) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('chapters')
    .insert([{ project_id, title, content, order_num, user_id: user.id }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateChapter(id, fields) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('chapters')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteChapter(id) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

// PERSONAJES
export async function getCharacters(project_id) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createCharacter({ project_id, name, role, description, avatar_url, status }) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('characters')
    .insert([{ project_id, name, role, description, avatar_url, status, user_id: user.id }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateCharacter(id, fields) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('characters')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteCharacter(id) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

// LUGARES
export async function getLocations(project_id) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createLocation({ project_id, name, type, region, description, status }) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('locations')
    .insert([{ project_id, name, type, region, description, status, user_id: user.id }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateLocation(id, fields) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('locations')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteLocation(id) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

// WIKI
export async function getWikiEntries(project_id) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('wiki_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createWikiEntry({ project_id, term, category, content, status }) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('wiki_entries')
    .insert([{ project_id, term, category, content, status, user_id: user.id }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateWikiEntry(id, fields) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('wiki_entries')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteWikiEntry(id) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('wiki_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

// NOTAS
export async function getNotes(project_id) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createNote({ project_id, title, content, pinned }) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('notes')
    .insert([{ project_id, title, content, pinned, user_id: user.id }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateNote(id, fields) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('notes')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteNote(id) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
} 