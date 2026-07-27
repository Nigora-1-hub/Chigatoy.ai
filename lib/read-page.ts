import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt, PROMPT_VERSION, type SourceType, type SourceLang, type TranslitStyle } from './prompts/v1';
import { createServiceClient } from './supabase/server';

const MODEL = 'claude-sonnet-4-6';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ReadPageLine = { ar: string; lat: string; cyr: string };
export type ReadPageNote = { soz: string; izoh: string };

export type ReadPageResult = {
  meta: { yozuv: string; davr: string; janr: string; ishonch: string };
  satrlar: ReadPageLine[];
  modern: string;
  izohlar: ReadPageNote[];
  xato: string | null;
};

function stripMarkdownFences(text: string): string {
  return text.trim().replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
}

async function callModel(imageBase64: string, prompt: string) {
  return anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: prompt },
        ],
      },
    ],
  });
}

export async function readPage(opts: {
  imageBase64: string;
  sourceType?: SourceType;
  sourceLang?: SourceLang;
  translitStyle: TranslitStyle;
  userId: string;
  pageId?: string;
}): Promise<ReadPageResult> {
  const prompt = buildPrompt({
    sourceType: opts.sourceType,
    sourceLang: opts.sourceLang,
    translitStyle: opts.translitStyle,
  });

  let res = await callModel(opts.imageBase64, prompt);
  let parsed = tryParse(res);

  if (!parsed) {
    res = await callModel(opts.imageBase64, prompt);
    parsed = tryParse(res);
  }

  await logUsage(opts.userId, opts.pageId, res);

  if (!parsed) {
    throw new Error('Model javobini JSON sifatida oʻqib boʻlmadi');
  }

  return parsed;
}

function tryParse(res: Anthropic.Messages.Message): ReadPageResult | null {
  const block = res.content.find((c) => c.type === 'text');
  if (!block || block.type !== 'text') return null;
  try {
    return JSON.parse(stripMarkdownFences(block.text));
  } catch {
    return null;
  }
}

async function logUsage(userId: string, pageId: string | undefined, res: Anthropic.Messages.Message) {
  const supabase = createServiceClient();
  await supabase.from('usage_log').insert({
    user_id: userId,
    page_id: pageId,
    model: MODEL,
    input_tokens: res.usage.input_tokens,
    output_tokens: res.usage.output_tokens,
  });
}

export { PROMPT_VERSION };
