// frontend/lib/api.js
export async function apiFetch(path, opts = {}){
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...opts
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
