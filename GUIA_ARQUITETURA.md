# 🛒 Guia de Arquitetura - Loja de Afiliados (Modelo Tititica)

Este documento resume a estrutura, as tecnologias e as funcionalidades desenvolvidas para este projeto. O objetivo é servir como um 'mapa' para que você possa clonar, adaptar e lançar novas lojas de afiliados rapidamente com a mesma base poderosa.

## 🛠️ Tecnologias Utilizadas
- **Framework Principal:** Next.js 15+ (App Router, Server Actions e Turbopack)
- **Estilização:** Tailwind CSS v4 (com animações CSS puras no globals.css)
- **Banco de Dados:** Prisma ORM com PostgreSQL (Neon DB)
- **Autenticação:** NextAuth.js v4 (Credentials Provider com bcryptjs para hash de senhas)
- **Gráficos:** Recharts (React Chart.js)

---

## 🚀 Funcionalidades da Vitrine (Cliente)
1. **Grid de Produtos:** Exibição em cascata com animações CSS suaves.
2. **Sistema de Categorias:** Filtro por categorias geradas dinamicamente com base no banco de dados.
3. **Barra de Pesquisa:** Busca inteligente sensível a maiúsculas/minúsculas usando parâmetros de URL (\?q=...\).
4. **Produtos em Destaque:** Selo especial e bordas diferenciadas baseadas na propriedade booleana \isFeatured\.
5. **Botão de WhatsApp:** Geração dinâmica de link da API do WhatsApp contendo o título, preço e link do produto.
6. **Redirecionamento Invisível (Analytics):** O botão 'Eu Quero' não vai direto para o site parceiro. Ele passa pela rota \/api/go?id=...\ que soma +1 no banco de dados e redireciona (HTTP 302) o cliente para preservar o cookie de afiliado.
7. **Design e Parallax:** Utilização da classe \g-fixed\ do Tailwind combinada com \@keyframes\ personalizadas para um efeito parallax leve voltado para conversão mobile.

---

## ⚙️ Funcionalidades do Painel de Controle (Admin)
O painel fica protegido por senha e é gerido via Server Components do Next.js.
Possui um sistema de abas construído do zero, sem bibliotecas pesadas:

1. **Aba de Cadastro de Produtos:**
   - Formulário com capacidade de pré-preenchimento via URL (Bookmarklet / Extensão).
   - Uso de \<datalist>\ no input de categorias, permitindo criar novas ou sugerir existentes.
   - Lista inferior de gestão: Permite exclusão de produtos em 1 clique (Server Actions).

2. **Aba de Gráficos (Dashboard):**
   - Gráfico de Barras com o 'Top 5 Produtos Mais Clicados'.
   - Gráfico de Pizza exibindo a distribuição de 'Cliques por Categoria'.

3. **Aba de Equipe e Acessos:**
   - Criação de novos usuários administradores (com hash de senha).
   - Troca de senhas de usuários existentes.
   - Lista visual de toda a equipe cadastrada.

---

## 🔌 Estrutura de Rotas e Banco (Prisma)
### Modelos Principais
- **User:** \id\, \email\, \password\ (criptografada).
- **Product:** \id\, \	itle\, \price\, \imageUrl\, \originalUrl\ (link base), \ffiliateUrl\ (link de venda), \category\, \isFeatured\, \clicks\.

### Endpoints
- \/\: Vitrine (Home).
- \/?category=X&q=Y\: Vitrine filtrada.
- \/acesso-restrito\: Tela de Login (NextAuth).
- \/tititica-painel\: Dashboard Privado.
- \/api/go\: Rota de Tracking de cliques e redirecionamento.

---

## 💡 Como Clonar para a Próxima Loja
1. Copie o código-fonte inteiro.
2. Troque o nome e as cores principais nos arquivos (ex: \g-pink-500\ para a cor do novo projeto).
3. Substitua a logo (\public/logo.png\).
4. Crie um novo banco de dados no Neon e atualize a variável \DATABASE_POSTGRES_URL\ no arquivo \.env\.
5. Rode \
px prisma db push\ para criar as tabelas no novo banco.
6. Rode \
pm run build\ e faça o deploy na Vercel!
