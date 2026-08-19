import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Busca o produto e incrementa o clique em uma unica operacao
    const product = await prisma.product.update({
      where: { id },
      data: {
        clicks: { increment: 1 }
      }
    });

    // Redireciona para o link de afiliado
    return NextResponse.redirect(product.affiliateUrl);
  } catch (error) {
    console.error("Erro ao rastrear clique:", error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
