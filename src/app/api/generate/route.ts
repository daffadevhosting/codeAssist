// src/app/api/generate/route.ts
import { generateCode } from '@/app/actions'; // Impor fungsi yang sudah kita buat
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, template, apiKey, model, reasoning } = body;

    if (!prompt || !template || !apiKey || !model) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Panggil server action kita yang sudah ada
    const result = await generateCode([ { role: 'user', content: prompt } ], template, apiKey, reasoning, model);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}