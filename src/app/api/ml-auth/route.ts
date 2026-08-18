import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const appId = process.env.ML_APP_ID;
  const clientSecret = process.env.ML_CLIENT_SECRET;
  const redirectUri = 'https://lojinha-tititica.vercel.app/api/ml-auth';

  if (!appId || !clientSecret) {
    return NextResponse.json({ error: 'Configuracoes do ML ausentes no Vercel' });
  }

  // Se nao tem codigo, redireciona para autorizar
  if (!code) {
    const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${appId}&redirect_uri=${redirectUri}`;
    return NextResponse.redirect(authUrl);
  }

  // Troca o codigo pelo token
  const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: appId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await tokenResponse.json();

  if (data.access_token) {
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    
    await prisma.mLToken.upsert({
      where: { id: '1' },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: expiresAt,
      },
      create: {
        id: '1',
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: expiresAt,
      },
    });

    return NextResponse.json({ success: true, message: 'App conectado com sucesso! O token foi salvo no banco de dados. Você já pode fechar esta aba e usar o painel da Tititica.' });
  } else {
    return NextResponse.json({ 
      error: 'Falha ao obter token', 
      details: data,
      debug: {
        appId_length: appId.length,
        appId_start: appId.substring(0, 3),
        secret_length: clientSecret.length,
        secret_start: clientSecret.substring(0, 3),
        secret_end: clientSecret.substring(clientSecret.length - 3)
      }
    });
  }
}
