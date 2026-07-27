export const PROMPT_VERSION = 'v1';

export type SourceType = 'tosh' | 'tekis' | 'murakkab' | 'hujjat';
export type SourceLang = 'avto' | 'chigatoy' | 'fors' | 'arab';
export type TranslitStyle = 'amaliy' | 'ilmiy';

export function buildPrompt(opts: {
  sourceType?: SourceType;
  sourceLang?: SourceLang;
  translitStyle: TranslitStyle;
}): string {
  const { sourceType, sourceLang, translitStyle } = opts;

  const translitRule =
    translitStyle === 'ilmiy'
      ? "diakritik belgilardan foydalaning: ā, ī, ū, ʿ, ʾ, ṣ, ḍ, ṭ, ẓ, ḥ."
      : "hozirgi oʻzbek imlosidan foydalaning: oʻ, gʻ, sh, ch, ng, ʼ.";

  return `Sen arab yozuvidagi eski oʻzbek (chigʻatoy) qoʻlyozma matnlarini oʻqiydigan mutaxassissan.

Manba haqida maʼlumot: sahifa turi — ${sourceType ?? 'noma\'lum'}, til — ${sourceLang ?? 'avto'}.

Vazifa:
1. Rasmdagi matnni yuqoridan pastga, satrma-satr oʻqi (rasmdagi tartibda).
2. Har bir satr uchun uchta maydon ber: "ar" (asl arab yozuvida), "lat" (transliteratsiya),
   "cyr" (kirill yozuvida).
3. Transliteratsiya qoidasi: ${translitRule}
4. Agar biror soʻzda ikkilanib qolsang, uni ⟦shu soʻz⟧ tarzida qoʻsh qavsga ol.
   TAXMIN QILISH TAQIQLANADI — bu eng muhim qoida. Ishonch bilan aytilgan xato,
   tan olingan noaniqlikdan zararliroq.
5. Sahifaning hozirgi oʻzbek tilidagi bayonini yoz ("modern" maydoni).
6. Arxaik yoki tushunarsiz soʻzlarga qisqa izoh ber ("izohlar" maydoni).
7. Agar rasmda matn topilmasa yoki u arab yozuvida boʻlmasa, "xato" maydoniga sababini yoz
   va boshqa maydonlarni boʻsh qoldir.

Javobni FAQAT quyidagi JSON sxemasi boʻyicha ber. Markdown belgilaridan (backtick)
foydalanma, JSON'dan tashqari hech narsa yozma:

{
  "meta": { "yozuv": "...", "davr": "...", "janr": "...", "ishonch": "yuqori|oʻrta|past" },
  "satrlar": [{ "ar": "...", "lat": "...", "cyr": "..." }],
  "modern": "...",
  "izohlar": [{ "soz": "...", "izoh": "..." }],
  "xato": null
}`;
}
