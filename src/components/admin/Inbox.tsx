import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Inquiry { id: string; created_at: string; name: string; email: string; message: string }
export function Inbox() {
  const [messages, setMessages] = useState<Inquiry[]>([]);
  const [notice, setNotice] = useState('Loading inquiries…');
  const [page, setPage] = useState(0);
  useEffect(() => {
    let active = true;
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).order('id').range(page * 25, page * 25 + 25).then(({ data, error }) => {
      if (!active) return;
      setMessages(data ?? []);
      setNotice(error ? error.message : data?.length ? '' : 'No inquiries yet.');
    });
    return () => { active = false; };
  }, [page]);
  return <section><p role="status">{notice}</p>{messages.slice(0, 25).map(item =>
    <article key={item.id} className="border-b border-border py-4">
      <h4>{item.name}</h4><a className="text-primary" href={`mailto:${item.email}`}>{item.email}</a>
      <p>{new Date(item.created_at).toLocaleString()}</p><p className="whitespace-pre-wrap break-words">{item.message}</p>
    </article>)}
    <div className="flex gap-4">{page > 0 && <button onClick={() => setPage(page - 1)}>Previous</button>}
    {messages.length > 25 && <button onClick={() => setPage(page + 1)}>Next</button>}</div></section>;
}
