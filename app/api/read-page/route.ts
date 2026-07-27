import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import { readPage } from '@/lib/read-page';
import type { TranslitStyle } from '@/lib/prompts/v1';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Tizimga kirilmagan' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const translitStyle = (formData.get('translitStyle') as TranslitStyle) || 'amaliy';

  if (!file) {
    return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const resized = await sharp(buffer)
    .resize({ width: 1568, height: 1568, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  try {
    const result = await readPage({
      imageBase64: resized.toString('base64'),
      translitStyle,
      userId: user.id,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Nomaʼlum xato' },
      { status: 500 }
    );
  }
}
