# Chigʻatoy.ai — texnik topshiriq

**Versiya:** 1.0 · **Sana:** 2026-07-27
**Muddat:** ishlaydigan MVP — 2026-08-24 (President Tech Award arizasi 30-avgust)
**Buyurtmachi:** Nigora Asqaraliyeva, Shabnam Ixtiyorova

> Bu hujjatni loyiha papkasining ildiziga `SPEC.md` nomi bilan saqlang va Claude Code'ga
> "SPEC.md ni oʻqi va 1-bosqichdan boshla" deb ayting.

---

## 1. Loyiha nima qiladi

Foydalanuvchi arab yozuvidagi eski oʻzbek (chigʻatoy) matnining skanini yuklaydi. Tizim uni
satrma-satr oʻqib, hozirgi oʻzbek yozuviga oʻgiradi, hozirgi tilga bayon qiladi va
foydalanuvchiga natijani tahrirlash imkonini beradi.

**Strategik maqsad:** tahrirlangan har bir satr `verified` belgisi bilan bazada saqlanadi.
Bu toʻplam kelgusida maxsus HTR modeli oʻqitish uchun asosiy aktiv. Mahsulotning har bir
qismi shu maqsadga xizmat qilishi kerak — tahrirlashni oson, eksportni standart qilish.

**Oʻxshash mahsulotlar (referens):** lisan.tatar/mektupler, osmanlica.com, transleyt.com

---

## 2. Scope — nima kiradi, nima kirmaydi

### 2.1 MVP'ga kiradi (majburiy)

| # | Funksiya |
|---|---|
| F1 | Email + parol bilan roʻyxatdan oʻtish va kirish |
| F2 | Rasm (JPG/PNG/WEBP) va PDF yuklash, maks. 20 MB |
| F3 | PDF'ni sahifalarga ajratish va navbat bilan qayta ishlash |
| F4 | Sahifani satrma-satr oʻqish: arab yozuvi + lotin + kirill |
| F5 | Hozirgi oʻzbek tilida bayon + arxaik soʻzlar izohi |
| F6 | Har bir satrni tahrirlash va saqlash |
| F7 | Hujjatlar tarixi, qayta ochish, oʻchirish |
| F8 | Eksport: `.txt`, `.docx`, korpus uchun `.tsv` |
| F9 | Bepul limit: oyiga 20 sahifa. Limit tugagach — kutish roʻyxati formasi |
| F10 | Landing sahifa: nima qilishi, demo, aniqlik haqida ochiq ogohlantirish |

### 2.2 MVP'ga kirmaydi (30-avgustdan keyin)

Toʻlov tizimi · jamoaviy ishlash · mobil ilova · oʻz HTR modeli · qidiruv bilan raqamli
kutubxona · API boshqalar uchun · matn tanlash uchun bounding box · koʻp tilli interfeys.

**Muhim:** bu roʻyxatdagi biror narsani MVP'ga qoʻshish taklifi kelsa — rad eting.
Besh haftada faqat 2.1 bajariladi.

---

## 3. Texnologik stack

```
Frontend + Backend : Next.js 15 (App Router), TypeScript
Styling            : Tailwind CSS
Auth + DB + Storage: Supabase (Postgres, Auth, Storage)
Model              : Anthropic API, claude-sonnet-4-6 (vision)
Navbat             : Supabase'da oddiy `jobs` jadvali + Vercel Cron (Redis kerak emas)
PDF                : pdf-lib yoki pdfjs-dist (serverda sahifa → PNG)
Rasm               : sharp (oʻlcham va sifat optimallashtirish)
Hosting            : Vercel
```

### Qatʼiy qoidalar

1. **Anthropic API kaliti hech qachon brauzerga tushmaydi.** Faqat server route ichida,
   `process.env.ANTHROPIC_API_KEY`. Buni buzadigan kod qabul qilinmaydi.
2. Har bir model chaqiruvi `usage` jadvaliga token soni bilan yoziladi.
3. Rasm modelga yuborilishdan oldin `sharp` bilan uzun tomoni **1568 px**'ga
   kichraytiriladi va JPEG 85% sifatda beriladi. Bundan kattasi tokenni behuda sarflaydi,
   aniqlikni oshirmaydi.
4. Barcha Postgres jadvallarida Row Level Security yoqiladi — foydalanuvchi faqat oʻz
   yozuvlarini koʻradi.

---

## 4. Maʼlumotlar bazasi

```sql
-- profiles: Supabase auth.users ga bogʻlanadi
profiles (
  id uuid primary key references auth.users,
  full_name text,
  role text default 'user',          -- user | researcher | admin
  plan text default 'free',
  pages_used_this_month int default 0,
  quota_reset_at timestamptz,
  created_at timestamptz default now()
)

documents (
  id uuid primary key,
  user_id uuid references profiles,
  title text not null,
  source_type text,                  -- tosh | tekis | murakkab | hujjat
  source_lang text,                  -- avto | chigatoy | fors | arab
  translit_style text,               -- amaliy | ilmiy
  page_count int default 0,
  created_at timestamptz default now()
)

pages (
  id uuid primary key,
  document_id uuid references documents on delete cascade,
  page_no int not null,
  image_path text not null,          -- Supabase Storage yoʻli
  status text default 'pending',     -- pending | processing | done | failed
  error_message text,
  meta jsonb,                        -- {yozuv, davr, janr, ishonch}
  modern_text text,
  notes jsonb,                       -- [{soz, izoh}]
  prompt_version text,
  processed_at timestamptz
)

lines (
  id uuid primary key,
  page_id uuid references pages on delete cascade,
  line_no int not null,
  ar_text text,                      -- arab yozuvidagi satr
  lat_raw text,                      -- model bergan transliteratsiya
  lat_corrected text,                -- foydalanuvchi tuzatgani
  cyr_text text,
  is_verified boolean default false, -- foydalanuvchi tasdiqlagan
  verified_by uuid references profiles,
  verified_at timestamptz
)

jobs (
  id uuid primary key,
  page_id uuid references pages on delete cascade,
  status text default 'queued',      -- queued | running | done | failed
  attempts int default 0,
  created_at timestamptz default now()
)

usage_log (
  id bigserial primary key,
  user_id uuid,
  page_id uuid,
  model text,
  input_tokens int,
  output_tokens int,
  created_at timestamptz default now()
)
```

**Indekslar:** `pages(document_id, page_no)`, `lines(page_id, line_no)`,
`jobs(status, created_at)`, `usage_log(user_id, created_at)`.

---

## 5. Server route'lar

| Metod | Yoʻl | Vazifa |
|---|---|---|
| POST | `/api/documents` | Hujjat yaratish, fayl yuklash uchun signed URL qaytarish |
| POST | `/api/documents/:id/pages` | Yuklangan faylni sahifalarga ajratish, `jobs`ga qoʻshish |
| POST | `/api/jobs/run` | Cron chaqiradi: navbatdagi 3 ta ishni bajaradi |
| GET | `/api/documents/:id` | Hujjat + sahifalar + satrlar |
| PATCH | `/api/lines/:id` | `lat_corrected` saqlash, `is_verified = true` |
| POST | `/api/pages/:id/retry` | Qayta oʻqish |
| GET | `/api/export/:documentId?format=txt\|docx\|tsv` | Eksport |
| GET | `/api/quota` | Qolgan limit |

### Navbat mantigʻi

Vercel Cron har 1 daqiqada `/api/jobs/run` chaqiradi. Route `status='queued'` boʻlgan
eng eski 3 ta ishni oladi, `running` qiladi, bajaradi. Xato boʻlsa `attempts++`;
3 martadan keyin `failed` va sahifaga xato xabari yoziladi. Bir vaqtda bir
foydalanuvchining maks. 5 ta ishi ishlanadi (boshqalar navbatda kutadi).

---

## 6. Model chaqiruvi

`lib/read-page.ts` da yagona funksiya. Prompt matni `lib/prompts/v1.ts` faylida saqlanadi
va har bir sahifaga `prompt_version` yozib qoʻyiladi — keyinchalik qaysi prompt qanday
natija berganini solishtirish uchun.

```ts
const res = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4000,
  messages: [{ role: 'user', content: [
    { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } },
    { type: 'text', text: buildPrompt({ sourceType, sourceLang, translitStyle }) }
  ]}]
});
```

### Prompt talablari

Prompt quyidagilarni qatʼiy talab qilishi kerak:

- Satrma-satr, rasmdagi tartibda (yuqoridan pastga).
- Har bir satr uchun: `ar` (arab yozuvi), `lat` (transliteratsiya), `cyr` (kirill).
- Ikkilanilgan soʻz `⟦...⟧` ichiga olinadi. **Taxmin qilish taqiqlanadi** — bu eng muhim
  qoida, chunki ishonch bilan aytilgan xato tan olingan noaniqlikdan zararliroq.
- `translitStyle = 'ilmiy'` boʻlsa diakritik belgilar (ā, ī, ū, ʿ, ʾ, ṣ, ḍ, ṭ, ẓ, ḥ),
  `'amaliy'` boʻlsa hozirgi oʻzbek imlosi (oʻ, gʻ, sh, ch, ng, ʼ).
- Javob faqat JSON, markdown backtick'siz.
- Matn topilmasa yoki arab yozuvida boʻlmasa — `xato` maydoniga sabab.

Javob sxemasi:

```json
{
  "meta": { "yozuv": "...", "davr": "...", "janr": "...", "ishonch": "yuqori|oʻrta|past" },
  "satrlar": [{ "ar": "...", "lat": "...", "cyr": "..." }],
  "modern": "...",
  "izohlar": [{ "soz": "...", "izoh": "..." }],
  "xato": null
}
```

JSON parse xato bersa: bir marta qayta urinib koʻriladi, keyin `failed`.

---

## 7. Sahifalar

| Yoʻl | Tavsif |
|---|---|
| `/` | Landing: qisqa taʼrif, jonli demo (bitta namuna skan), aniqlik ogohlantirishi, roʻyxatdan oʻtish |
| `/login`, `/signup` | Supabase auth |
| `/app` | Hujjatlar roʻyxati + yangi yuklash |
| `/app/d/[id]` | **Asosiy ish maydoni** |
| `/about` | Loyiha, jamoa, hamkorlar, aloqa |

### Ish maydoni (`/app/d/[id]`) — eng muhim ekran

Ikki panelli **yoyma**: oʻngda manba skani, chapda oʻqilishi. Bu qoʻlyozma oʻngdan chapga
oʻqilgani uchun shunday — tasodifiy tanlov emas.

- Chap panelda har bir satr: tepada arab yozuvi (`Noto Nastaliq Urdu`, RTL), tagida
  tahrirlanadigan transliteratsiya, ostida kirill.
- `⟦...⟧` ichidagi soʻzlar qizil punktir bilan ajratiladi.
- Satr tahrirlanib fokusdan chiqqanda avtomatik saqlanadi (debounce 800 ms), yonida
  kichik "saqlandi" belgisi chiqadi.
- Tepada sahifa navigatsiyasi (< 3 / 12 >) va sahifa holati.
- Pastda: hozirgi tilda bayon, izohlar, eksport tugmalari.
- Mobilda panellar ustma-ust, skan birinchi.

Dizayn tili tayyor prototipda belgilangan (`chigatoy-ai.html`): Samarqand qogʻozi rangi,
lojuvard aksent, shingarf bilan shubhali soʻzlar, jadval ramkasi. Shundan chetlashmang.

---

## 8. Xavfsizlik va limitlar

- Fayl: maks. 20 MB, maks. 30 sahifa PDF. MIME turi serverda tekshiriladi.
- Rate limit: bir foydalanuvchi daqiqasiga 10 ta soʻrov.
- Bepul reja: oyiga 20 sahifa. `pages_used_this_month` har oy 1-sanada nolga tushadi.
- Supabase Storage bucket'i **private**, faqat signed URL orqali koʻriladi.
- Foydalanuvchi hujjatni oʻchirsa — rasm ham Storage'dan oʻchadi.
- `.env.local` hech qachon git'ga tushmaydi. `.gitignore` birinchi commit'da yoziladi.

---

## 9. Besh haftalik reja

### 1-hafta (28-iyul – 3-avgust) — poydevor
- [ ] Next.js loyiha, Supabase ulanishi, jadvallar va RLS
- [ ] Auth: signup / login / logout
- [ ] Bitta rasm yuklash → server route → model → natija ekranda
- [ ] Vercel'ga birinchi deploy, domen ulanadi
- **Natija:** internetda ishlaydigan manzil bor, bitta rasmni oʻqiydi

### 2-hafta (4–10-avgust) — asosiy ish maydoni
- [ ] PDF → sahifalar, `jobs` navbati, Vercel Cron
- [ ] Yoyma interfeysi, sahifa navigatsiyasi
- [ ] Satrni tahrirlash va avtosaqlash
- [ ] Hujjatlar tarixi
- **Natija:** 12 sahifalik PDF'ni yuklab, oʻqib, tuzatib chiqish mumkin

### 3-hafta (11–17-avgust) — toʻldirish
- [ ] Eksport: txt, docx, tsv
- [ ] Limit tizimi va kutish roʻyxati
- [ ] Landing sahifa va demo
- [ ] Mobil moslashuv, xatoliklar holati, boʻsh ekranlar
- **Natija:** begona odam yordamsiz ishlata oladi

### 4-hafta (18–24-avgust) — sinov va oʻlchov
- [ ] **Benchmark:** 20 ta sahifani qoʻlda transkripsiya qiling (turli xat turlari:
      5 tosh bosma, 5 tekis nastaʼliq, 5 murakkab, 5 hujjat). Tizim natijasi bilan
      solishtirib, **soʻz darajasidagi aniqlik foizini** hisoblang.
- [ ] 20–30 filolog, tarixchi va talabaga bering, foydalanishni kuzating
- [ ] Kritik xatolarni tuzating
- **Natija:** aniqlik raqami va real foydalanuvchi statistikasi bor

### 5-hafta (25–30-avgust) — ariza
- [ ] Demo video (2–3 daqiqa, real skan bilan)
- [ ] Pitch deck yangilanadi: eski slaydlardagi 12–18 oylik reja olib tashlanadi,
      oʻrniga ishlaydigan mahsulot va aniqlik raqami qoʻyiladi
- [ ] awards.gov.uz orqali ariza — **25-avgustda topshiring**, oxirgi kunni kutmang
- **Natija:** topshirilgan ariza

---

## 10. Qabul mezonlari

Loyiha tayyor hisoblanadi, agar:

1. Ommaviy manzilda ishlaydi, roʻyxatdan oʻtish talab qiladi.
2. 12 sahifalik PDF 5 daqiqadan kam vaqtda toʻliq qayta ishlanadi.
3. Tosh bosma matnda soʻz aniqligi **80% dan yuqori**.
4. Tahrirlangan satr sahifa yangilanganda saqlanib qoladi.
5. `.tsv` eksporti `arab_matn <TAB> tuzatilgan_transliteratsiya` formatida chiqadi.
6. Telefonda ishlaydi.
7. API kaliti brauzer tarmoq soʻrovlarida koʻrinmaydi.
8. Kamida 20 ta real foydalanuvchi va 200 ta qayta ishlangan sahifa statistikasi bor.

---

## 11. Ariza uchun eslatma

Hakamlarga eng kuchli taʼsir qiladigan uchta narsa — mahsulot dizayni emas:

1. **Aniqlik raqami.** "Tosh bosma matnlarda 87% soʻz aniqligi, 20 sahifalik nazorat
   toʻplamida oʻlchangan." Raqamsiz daʼvo ishonchsiz.
2. **Nima uchun aynan siz.** Sharqshunoslik instituti yoki universitet bilan hamkorlik
   xati boʻlsa — bu takrorlanmaydigan ustunlik. 4-haftagacha shuni olishga urinib koʻring.
3. **Nima uchun bu oddiy AI oʻrami emas.** Javob: tuzatilgan korpus. Har bir foydalanuvchi
   mahsulotni yaxshilaydi va bu maʼlumotni raqobatchi sotib ololmaydi. Shu jumlani arizada
   aynan shunday ayting.

---

## 12. Claude Code bilan qanday ishlash

1. Papka oching, ichiga shu faylni `SPEC.md` nomi bilan saqlang.
2. Terminalda `claude` deb yozing.
3. Birinchi buyruq: `SPEC.md ni oʻqi. 9-boʻlimdagi 1-hafta vazifalarini bajar. Har bir
   qadamdan keyin toʻxtab, nima qilganingni tushuntir.`
4. Har bosqich oxirida saqlang: `git add -A && git commit -m "..."`
5. Xato chiqsa — xato matnini toʻliq nusxalab Claude Code'ga bering, oʻzi tuzatadi.
6. Bir vazifani bajarmasdan ikkinchisiga oʻtmang.
