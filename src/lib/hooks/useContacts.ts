import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';
import type { Contact, ContactStage } from '../types';

export function useContacts(userId: string | null) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!userId) { setContacts([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (data) setContacts(data as Contact[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const saveContact = useCallback(async (contact: Partial<Contact> & { name: string }) => {
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    const now = new Date().toISOString();

    if (contact.id) {
      const { data, error } = await supabase
        .from('contacts')
        .update({ ...contact, updated_at: now })
        .eq('id', contact.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (!error && data) {
        setContacts(prev => prev.map(c => c.id === data.id ? data as Contact : c));
      }
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from('contacts')
        .insert({ ...contact, user_id: userId, created_at: now, updated_at: now })
        .select()
        .single();
      if (!error && data) {
        setContacts(prev => [data as Contact, ...prev]);
      }
      return { data, error };
    }
  }, [userId]);

  const deleteContact = useCallback(async (contactId: string) => {
    if (!userId) return;
    await supabase.from('contacts').delete().eq('id', contactId).eq('user_id', userId);
    setContacts(prev => prev.filter(c => c.id !== contactId));
  }, [userId]);

  const updateStage = useCallback(async (contactId: string, stage: ContactStage) => {
    return saveContact({ id: contactId, name: '', stage } as any);
  }, [saveContact]);

  const scheduledContacts = contacts.filter(c => c.meeting_date);
  const byStage = (stage: ContactStage) => contacts.filter(c => c.stage === stage);

  return {
    contacts,
    loading,
    fetchContacts,
    saveContact,
    deleteContact,
    updateStage,
    scheduledContacts,
    byStage,
  };
}
