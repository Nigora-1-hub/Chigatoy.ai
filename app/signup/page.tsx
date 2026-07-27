import { signup } from '@/app/auth/actions';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Roʻyxatdan oʻtish</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form action={signup} className="flex flex-col gap-3">
        <input
          name="fullName"
          type="text"
          placeholder="Ismingiz"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Parol"
          required
          minLength={6}
          className="rounded border px-3 py-2"
        />
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Roʻyxatdan oʻtish
        </button>
      </form>
      <p className="text-sm">
        Hisobingiz bormi? <a href="/login" className="underline">Kiring</a>
      </p>
    </main>
  );
}
