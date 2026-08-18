import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getMLToken() {
  const token = await prisma.mLToken.findUnique({ where: { id: '1' } });
  
  if (!token) {
    return null;
  }

  // Se expira em menos de 10 minutos, renova
  if (token.expiresAt.getTime() - Date.now() < 10 * 60 * 1000) {
    const appId = process.env.ML_APP_ID;
    const clientSecret = process.env.ML_CLIENT_SECRET;

    if (!appId || !clientSecret) return null;

    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: appId,
        client_secret: clientSecret,
        refresh_token: token.refreshToken,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      const expiresAt = new Date(Date.now() + data.expires_in * 1000);
      await prisma.mLToken.update({
        where: { id: '1' },
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: expiresAt,
        },
      });
      return data.access_token;
    }
  }

  return token.accessToken;
}
