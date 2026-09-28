import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { LibraryItem, LibraryItemInput } from '../types';

export interface LibraryItemView extends LibraryItem {
  cover_src: string | null;
  file_src: string | null;
}

function isRemoteUrl(value: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

async function signedAssetUrl(path: string | null) {
  if (!path || isRemoteUrl(path)) return path;
  const result = await supabase.storage.from('library').createSignedUrl(path, 3600);
  return result.data?.signedUrl ?? null;
}

async function hydrateItem(item: LibraryItem): Promise<LibraryItemView> {
  const [coverSrc, fileSrc] = await Promise.all([
    signedAssetUrl(item.cover_url),
    signedAssetUrl(item.file_url),
  ]);
  return { ...item, cover_src: coverSrc, file_src: fileSrc };
}

export function useLibraryItems(includeUnpublished = false) {
  const [items, setItems] = useState<LibraryItemView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('library_items').select('*').order('order_index');
    if (!includeUnpublished) query = query.eq('is_published', true);
    const result = await query;
    if (result.error) {
      setError(result.error.message);
      setItems([]);
      setLoading(false);
      return;
    }
    setItems(await Promise.all(((result.data ?? []) as LibraryItem[]).map(hydrateItem)));
    setLoading(false);
  }, [includeUnpublished]);

  useEffect(() => { void reload(); }, [reload]);
  return { items, loading, error, reload };
}

function fileExtension(file: File) {
  const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return extension || 'bin';
}

export async function uploadLibraryFile(file: File, folder: 'covers' | 'files') {
  const path = `${folder}/${crypto.randomUUID()}.${fileExtension(file)}`;
  const result = await supabase.storage.from('library').upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (result.error) throw result.error;
  return result.data.path;
}

async function removeStoredFiles(paths: Array<string | null | undefined>) {
  const storedPaths = paths.filter((path): path is string => Boolean(path && !isRemoteUrl(path)));
  if (storedPaths.length) await supabase.storage.from('library').remove(storedPaths);
}

export async function createLibraryItem(payload: LibraryItemInput) {
  return supabase.from('library_items').insert(payload).select().single();
}

export async function updateLibraryItem(id: string, payload: Partial<LibraryItemInput>) {
  return supabase.from('library_items').update(payload).eq('id', id).select().single();
}

export async function deleteLibraryItem(item: LibraryItem) {
  const result = await supabase.from('library_items').delete().eq('id', item.id);
  if (!result.error) await removeStoredFiles([item.cover_url, item.file_url]);
  return result;
}

export async function replaceLibraryFiles(item: LibraryItem | null, coverFile?: File | null, contentFile?: File | null) {
  const uploaded: string[] = [];
  try {
    const coverPath = coverFile ? await uploadLibraryFile(coverFile, 'covers') : item?.cover_url ?? null;
    if (coverFile && coverPath) uploaded.push(coverPath);
    const filePath = contentFile ? await uploadLibraryFile(contentFile, 'files') : item?.file_url ?? null;
    if (contentFile && filePath) uploaded.push(filePath);
    return { coverPath, filePath };
  } catch (error) {
    await removeStoredFiles(uploaded);
    throw error;
  }
}

export async function removeReplacedLibraryFiles(item: LibraryItem | null, coverPath: string | null, filePath: string | null) {
  if (!item) return;
  await removeStoredFiles([
    item.cover_url !== coverPath ? item.cover_url : null,
    item.file_url !== filePath ? item.file_url : null,
  ]);
}
