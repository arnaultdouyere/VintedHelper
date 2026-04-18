import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { targetFolderId, imageUrls, details, customPrompt, provider, model } = body;

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Images requises' }, { status: 400 });
    }
    if (!targetFolderId) {
      return NextResponse.json({ error: 'Dossier cible requis' }, { status: 400 });
    }
    
    const defaultPrompt = "Tu es un expert en vente de vêtements de seconde main sur Vinted. Analyse scrupuleusement la ou les photos fournies pour rédiger l'annonce la  plus vendeuse possible. Renvoie un objet JSON avec : \n- title: Un titre optimisé pour la recherche (ex: Marque Coupe Couleur).\n- description: Une description complète, aérée, sincère et chaleureuse.\n- hashtags: Une chaine contenant 10 à 15 hashtags Vinted très pertinents séparés par des espaces.";
    const activePrompt = customPrompt?.trim() ? customPrompt : defaultPrompt;
    
    let languageModel;
    if (provider === 'openai') {
       if (!process.env.OPENAI_API_KEY) throw new Error('Clé OPENAI_API_KEY manquante dans le fichier .env.local');
       languageModel = openai(model || 'gpt-4o');
    } else if (provider === 'anthropic') {
       if (!process.env.ANTHROPIC_API_KEY) throw new Error('Clé ANTHROPIC_API_KEY manquante dans le fichier .env.local');
       languageModel = anthropic(model || 'claude-3-5-sonnet-20240620');
    } else if (provider === 'google') {
       if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error('Clé GOOGLE_GENERATIVE_AI_API_KEY manquante dans le fichier .env.local');
       languageModel = google(model || 'gemini-1.5-pro-latest');
    } else {
       throw new Error('Provider IA non supporté');
    }

    const contentParts: any[] = [];
    contentParts.push({ type: 'text', text: activePrompt });
    
    if (details?.trim()) {
       contentParts.push({ type: 'text', text: `Détails supplémentaires fournis par le vendeur (merci de les intégrer à l'annonce de manière fluide) : ${details}` });
    }
    
    for (const url of imageUrls) {
       // ai sdk will automatically fetch this url to extract the image buffer
       contentParts.push({ type: 'image', image: new URL(url) }); 
    }

    const { object } = await generateObject({
      model: languageModel,
      schema: z.object({
         title: z.string().describe('Titre accrocheur, limité et optimisé'),
         description: z.string().describe('Description détaillée, polie et vendeuse'),
         hashtags: z.string().describe('Série de gros # séparés par des espaces')
      }),
      messages: [
         {
            role: 'user',
            content: contentParts
         }
      ],
      maxTokens: 1000,
    });

    // Initialize an empty product page array or simply store it via server actions
    // Wait, let's insert directly using supabase:
    const { data: newPage, error: insertError } = await supabase.from('product_pages').insert({
       user_id: user.id,
       folder_id: targetFolderId,
       title: object.title,
       description: object.description,
       hashtags: object.hashtags,
       status: 'draft'
    }).select().single();

    if (insertError) throw new Error(insertError.message);

    // If we want to link the images in DB to this new page, we could iterate over imageUrls and insert into `images` table...
    // But since the task only asks to create the "annonce", we'll do this:
    for (const url of imageUrls) {
       await supabase.from('images').insert({
          user_id: user.id,
          page_id: newPage.id,
          type: 'product',
          url: url
       });
    }

    return NextResponse.json({ success: true, pageId: newPage.id });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Une erreur est survenue lors de la génération' }, { status: 500 });
  }
}
