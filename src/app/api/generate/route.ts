// src/app/api/generate/route.ts
import { generateCode } from '@/app/actions'; // Impor fungsi yang sudah kita buat
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userPrompt = body.messages ? body.messages[0].content : body.prompt;

    // Pastikan prompt ada
    if (!userPrompt) {
        return NextResponse.json({ error: 'Prompt is missing' }, { status: 400 });
    }

    // Ubah body.messages menjadi array yang benar jika belum ada
    const messagesPayload = body.messages || [{ role: 'user', content: userPrompt }];

    // Panggil server action
    const result = await generateCode(messagesPayload, body.template, body.apiKey, body.reasoning, body.model, body.existingCode);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}