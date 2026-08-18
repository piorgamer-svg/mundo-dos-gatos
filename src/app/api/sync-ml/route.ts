import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Simple security check using an auth header or a secret query param to prevent random people from triggering it
  // In Vercel Cron, you can configure a secret. We will use a simple query param for now.
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany();
  let updatedCount = 0;
  let deletedCount = 0;

  for (const product of products) {
    if (product.source !== 'Mercado Livre') continue;

    // Extract MLB ID from originalUrl
    const match = product.originalUrl.match(/MLB-?(\d+)/i);
    if (!match) continue;
    
    const mlbId = 'MLB' + match[1];

    try {
      const response = await fetch(https://api.mercadolibre.com/items/ + mlbId);
      if (!response.ok) {
        // If 404, product might be completely gone
        if (response.status === 404) {
          await prisma.product.delete({ where: { id: product.id } });
          deletedCount++;
        }
        continue;
      }

      const data = await response.json();
      
      // If status is not active, delete the product
      if (data.status !== 'active') {
        await prisma.product.delete({ where: { id: product.id } });
        deletedCount++;
      } else {
        // Update price
        const newPrice = R$  + data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        if (newPrice !== product.price) {
          await prisma.product.update({
            where: { id: product.id },
            data: { price: newPrice }
          });
          updatedCount++;
        }
      }
    } catch (error) {
      console.error('Error syncing product', product.id, error);
    }
  }

  return NextResponse.json({ success: true, updatedCount, deletedCount });
}
