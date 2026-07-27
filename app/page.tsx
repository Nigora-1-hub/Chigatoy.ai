import Link from "next/link";

const PAPER = "#f6efdc";
const INK = "#241c12";
const LAPIS = "#1f3a63";
const LAPIS_DARK = "#132743";
const CINNABAR = "#b3261e";
const GOLD = "#a9822f";
const GOLD_LIGHT = "#e4cf8a";

function GoldRule() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px w-8" style={{ backgroundColor: GOLD }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: GOLD }} />
      <span className="h-px w-8" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ color: INK, backgroundColor: PAPER }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 backdrop-blur"
        style={{ backgroundColor: "rgba(246,239,220,0.88)", borderBottom: `2px solid ${GOLD_LIGHT}` }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-base font-semibold text-white ring-2"
              style={{ backgroundColor: LAPIS, fontFamily: "var(--font-display)", boxShadow: `0 0 0 2px ${PAPER}, 0 0 0 3px ${GOLD}` }}
            >
              چ
            </span>
            <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Chigʻatoy.ai
            </span>
          </Link>
          <nav className="flex items-center gap-7 text-sm">
            <Link href="/about" className="hidden opacity-75 transition hover:opacity-100 sm:inline">
              Loyiha haqida
            </Link>
            <Link href="/login" className="hidden opacity-75 transition hover:opacity-100 sm:inline">
              Kirish
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: LAPIS }}
            >
              Roʻyxatdan oʻtish
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: GOLD }} />
              <span
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Qoʻlyozmashunoslik + sunʼiy intellekt
              </span>
            </div>
            <h1
              className="mb-6 max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Eski oʻzbek qoʻlyozmalarini{" "}
              <span className="italic" style={{ color: LAPIS }}>
                bir zumda
              </span>{" "}
              oʻqing
            </h1>
            <p className="mb-9 max-w-md text-lg leading-relaxed" style={{ color: "#4a3f2f" }}>
              Arab yozuvidagi skanni yuklaysiz — tizim satrma-satr oʻqib, hozirgi oʻzbek
              yozuviga (lotin va kirill) oʻgiradi hamda zamonaviy tilda bayon qiladi.
              Natijani oʻzingiz tahrirlab, aniqlashtirasiz.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/signup"
                className="rounded-full px-7 py-3.5 font-medium tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ backgroundColor: LAPIS, boxShadow: "0 12px 24px -8px rgba(31,58,99,0.45)" }}
              >
                Bepul sinab koʻrish
              </Link>
              <a
                href="#qanday-ishlaydi"
                className="rounded-full border-2 px-7 py-3 font-medium transition hover:bg-black/5"
                style={{ borderColor: "rgba(169,130,47,0.45)", color: LAPIS_DARK }}
              >
                Qanday ishlaydi?
              </a>
            </div>
            <p className="mt-5 text-sm" style={{ color: "#6b5d45" }}>
              Oyiga 20 sahifagacha bepul, karta talab qilinmaydi
            </p>
          </div>

          {/* Manuscript preview card */}
          <div className="relative">
            <div
              className="absolute -inset-4 -rotate-2 rounded-2xl"
              style={{ backgroundColor: GOLD_LIGHT, opacity: 0.5 }}
            />
            <div
              className="relative -rotate-1 rounded-2xl p-7 shadow-2xl transition-transform hover:rotate-0"
              style={{
                backgroundColor: "#fffaf0",
                border: `1px solid ${GOLD_LIGHT}`,
                boxShadow: "0 30px 60px -20px rgba(36,28,18,0.35)",
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: GOLD }}
                >
                  Namuna satr
                </span>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: LAPIS }}
                >
                  1 / 12 sahifa
                </span>
              </div>
              <div className="space-y-3 border-t pt-5" style={{ borderColor: GOLD_LIGHT }}>
                <p
                  dir="rtl"
                  className="text-3xl leading-relaxed"
                  style={{ fontFamily: "var(--font-nastaliq)" }}
                >
                  بو کتاب <span style={{ borderBottom: `2px dashed ${CINNABAR}` }}>ياخشی</span> يازیلمیش
                </p>
                <p className="text-lg" style={{ color: "#4a3f2f" }}>
                  bu kitob <span style={{ borderBottom: `2px dashed ${CINNABAR}` }}>yaxshi</span> yozilmish
                </p>
                <p style={{ color: "#8a7a5c" }}>
                  бу китоб <span style={{ borderBottom: `2px dashed ${CINNABAR}` }}>яхши</span> ёзилмиш
                </p>
              </div>
              <p className="mt-5 text-xs" style={{ color: "#8a7a5c" }}>
                Qizil punktir — model ikkilanib qolgan soʻz. Siz tasdiqlaysiz yoki tuzatasiz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="qanday-ishlaydi" className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-4 flex justify-center">
          <GoldRule />
        </div>
        <h2
          className="mb-12 text-center text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Uch qadamda tayyor
        </h2>
        <div className="grid gap-7 sm:grid-cols-3">
          {[
            { n: "I", t: "Yuklang", d: "Skan qilingan rasm yoki PDF hujjatni yuklaysiz." },
            { n: "II", t: "Tekshiring", d: "Model har bir satrni oʻqib, transliteratsiya va bayon beradi." },
            { n: "III", t: "Yuklab oling", d: "Tahrirlangan matnni .txt, .docx yoki .tsv formatida eksport qilasiz." },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-xl p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: "#fffaf0", border: `1px solid ${GOLD_LIGHT}` }}
            >
              <span
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold"
                style={{ border: `2px solid ${GOLD}`, color: LAPIS, fontFamily: "var(--font-display)" }}
              >
                {step.n}
              </span>
              <h3 className="mb-2 text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {step.t}
              </h3>
              <p className="text-sm" style={{ color: "#5b4d38" }}>
                {step.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-7 sm:grid-cols-2">
          <div
            className="rounded-xl p-8 shadow-sm"
            style={{ backgroundColor: "#fffaf0", borderTop: `3px solid ${LAPIS}`, borderRight: `1px solid ${GOLD_LIGHT}`, borderBottom: `1px solid ${GOLD_LIGHT}`, borderLeft: `1px solid ${GOLD_LIGHT}` }}
          >
            <h2 className="mb-3 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Nima uchun bu shunchaki AI oʻrami emas
            </h2>
            <p style={{ color: "#4a3f2f" }}>
              Tahrirlangan har bir satr tasdiqlangan (verified) holatda saqlanadi. Bu
              toʻplam kelgusida oʻz HTR modelini oʻqitish uchun asosiy aktiv boʻladi —
              har bir foydalanuvchi mahsulotni yaxshilaydi.
            </p>
          </div>
          <div
            className="rounded-xl p-8 shadow-sm"
            style={{ backgroundColor: "#fffaf0", borderTop: `3px solid ${CINNABAR}`, borderRight: `1px solid ${GOLD_LIGHT}`, borderBottom: `1px solid ${GOLD_LIGHT}`, borderLeft: `1px solid ${GOLD_LIGHT}` }}
          >
            <h2 className="mb-3 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Ochiq ogohlantirish
            </h2>
            <p style={{ color: "#4a3f2f" }}>
              Tizim hali sinov bosqichida. Aniqlik matn turiga qarab oʻzgaradi — tosh
              bosma matnlarda yuqoriroq, murakkab qoʻlyozmalarda pastroq boʻlishi mumkin.
              Har doim natijani tekshirib chiqing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 py-20">
        <div
          className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl px-8 py-14 text-center shadow-2xl"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${LAPIS} 0%, ${LAPIS_DARK} 70%)`,
          }}
        >
          <div className="relative">
            <h2
              className="mb-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Birinchi sahifangizni bugun oʻqiting
            </h2>
            <p className="mx-auto mb-8 max-w-md text-white/75">
              Roʻyxatdan oʻting va bepul limit bilan darhol boshlang.
            </p>
            <Link
              href="/signup"
              className="inline-block rounded-full px-8 py-3.5 font-medium tracking-wide shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ backgroundColor: PAPER, color: LAPIS_DARK }}
            >
              Bepul sinab koʻrish
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10" style={{ borderTop: `2px solid ${GOLD_LIGHT}` }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-sm sm:flex-row" style={{ color: "#6b5d45" }}>
          <span>© {new Date().getFullYear()} Chigʻatoy.ai</span>
          <div className="flex gap-6">
            <Link href="/about" className="transition hover:opacity-70">Loyiha haqida</Link>
            <Link href="/login" className="transition hover:opacity-70">Kirish</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
