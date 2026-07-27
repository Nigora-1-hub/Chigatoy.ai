'use client';

import { useState } from 'react';
import { logout } from '@/app/auth/actions';

type ReadPageResult = {
  meta: { yozuv: string; davr: string; janr: string; ishonch: string };
  satrlar: { ar: string; lat: string; cyr: string }[];
  modern: string;
  izohlar: { soz: string; izoh: string }[];
  xato: string | null;
};

export default function AppHomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReadPageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('translitStyle', 'amaliy');

    const res = await fetch('/api/read-page', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Xato yuz berdi');
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chigʻatoy.ai — sinov yuklash</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">Chiqish</button>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 flex items-center gap-3">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? 'Oʻqilmoqda...' : 'Oʻqish'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="space-y-6">
          {result.xato ? (
            <p className="text-sm text-red-600">{result.xato}</p>
          ) : (
            <>
              <section>
                <h2 className="mb-2 font-medium">Satrlar</h2>
                <div className="space-y-2">
                  {result.satrlar.map((line, i) => (
                    <div key={i} className="rounded border p-3">
                      <p dir="rtl" className="font-[\'Noto_Nastaliq_Urdu\',serif] text-lg">
                        {line.ar}
                      </p>
                      <p className="text-sm text-gray-700">{line.lat}</p>
                      <p className="text-sm text-gray-500">{line.cyr}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="mb-2 font-medium">Hozirgi tilda bayon</h2>
                <p className="text-sm">{result.modern}</p>
              </section>
              {result.izohlar.length > 0 && (
                <section>
                  <h2 className="mb-2 font-medium">Izohlar</h2>
                  <ul className="list-disc pl-5 text-sm">
                    {result.izohlar.map((n, i) => (
                      <li key={i}>
                        <b>{n.soz}</b> — {n.izoh}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
