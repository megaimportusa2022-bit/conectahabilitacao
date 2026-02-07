# 📘 Manual de Gestão - ConectaHabilitação

## Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura Recomendada](#2-arquitetura-recomendada)
3. [Configurando o Supabase (Banco de Dados)](#3-configurando-o-supabase)
4. [Configurando o Stripe (Pagamentos)](#4-configurando-o-stripe)
5. [Produtos e Planos](#5-produtos-e-planos)
6. [Gerenciando Instrutores](#6-gerenciando-instrutores)
7. [Gerenciando Alunos](#7-gerenciando-alunos)
8. [Atualizando o Site](#8-atualizando-o-site)
9. [Monitoramento e Relatórios](#9-monitoramento-e-relatórios)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Visão Geral do Sistema

### O que é o ConectaHabilitação?
Plataforma que conecta instrutores de trânsito credenciados a alunos que buscam aulas particulares de direção.

### Fontes de Receita
| Produto | Descrição | Valor |
|---------|-----------|-------|
| Plano Gratuito | Perfil básico, até 5 contatos/mês | R$ 0 |
| Plano Profissional | Contatos ilimitados + selo verificado | R$ 49,90/mês |
| Plano Premium | Topo das buscas + página personalizada | R$ 99,90/mês |
| Plano Escola/CFC | Até 10 instrutores + dashboard | R$ 299,90/mês |
| Destaque 7 dias | Aparecer no topo por 7 dias | R$ 29,90 |
| Destaque 15 dias | Aparecer no topo por 15 dias | R$ 49,90 |
| Destaque 30 dias | Aparecer no topo por 30 dias | R$ 79,90 |
| Afiliados | Comissão por vendas de parceiros | Variável |

---

## 2. Arquitetura Recomendada

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   FRONTEND      │     │   SUPABASE      │     │    STRIPE       │
│   (Netlify)     │────▶│   (Backend)     │────▶│  (Pagamentos)   │
│                 │     │                 │     │                 │
│ - HTML/CSS/JS   │     │ - Banco de dados│     │ - Cartão        │
│ - Formulários   │     │ - Autenticação  │     │ - PIX           │
│ - Interface     │     │ - API           │     │ - Boleto        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Por que essa arquitetura?
- **Supabase**: Grátis para começar, fácil de usar, escala bem
- **Stripe**: Mais confiável, aceita PIX, bom para assinaturas
- **Netlify**: Já está configurado, deploy automático

---

## 3. Configurando o Supabase

### Passo 1: Criar conta
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"
5. Preencha:
   - **Name**: conectahabilitacao
   - **Database Password**: (anote em lugar seguro!)
   - **Region**: South America (São Paulo)
6. Clique em "Create new project"

### Passo 2: Criar as tabelas
Após criar o projeto, vá em **SQL Editor** e execute:

```sql
-- Tabela de Instrutores
CREATE TABLE instrutores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Dados Pessoais
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_nascimento DATE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  
  -- Endereço
  cep VARCHAR(9),
  estado VARCHAR(2) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  bairro VARCHAR(100),
  
  -- Credenciais
  cnh VARCHAR(11) NOT NULL,
  categoria_cnh VARCHAR(5) NOT NULL,
  validade_cnh DATE NOT NULL,
  credencial_instrutor VARCHAR(50) NOT NULL,
  validade_credencial DATE NOT NULL,
  cfc_vinculado VARCHAR(255) NOT NULL,
  
  -- Profissional
  categorias_leciona TEXT[], -- ['A', 'B', 'C']
  anos_experiencia VARCHAR(10),
  preco_aula DECIMAL(10,2) NOT NULL,
  veiculo_aula VARCHAR(255),
  sobre TEXT,
  foto_url TEXT,
  
  -- Plano e Status
  plano VARCHAR(20) DEFAULT 'gratuito', -- gratuito, profissional, premium
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, ativo, suspenso
  verificado BOOLEAN DEFAULT FALSE,
  destaque_ate DATE,
  
  -- Métricas
  visualizacoes INTEGER DEFAULT 0,
  contatos_mes INTEGER DEFAULT 0,
  avaliacao_media DECIMAL(2,1) DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0
);

-- Tabela de Alunos
CREATE TABLE alunos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  estado VARCHAR(2),
  cidade VARCHAR(100)
);

-- Tabela de Contatos (quando aluno contata instrutor)
CREATE TABLE contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  instrutor_id UUID REFERENCES instrutores(id),
  aluno_id UUID REFERENCES alunos(id),
  tipo VARCHAR(20) -- whatsapp, telefone, email
);

-- Tabela de Avaliações
CREATE TABLE avaliacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  instrutor_id UUID REFERENCES instrutores(id),
  aluno_id UUID REFERENCES alunos(id),
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  aprovado BOOLEAN DEFAULT FALSE
);

-- Tabela de Assinaturas
CREATE TABLE assinaturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  instrutor_id UUID REFERENCES instrutores(id),
  plano VARCHAR(20) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ativa', -- ativa, cancelada, expirada
  inicio DATE NOT NULL,
  fim DATE,
  valor DECIMAL(10,2) NOT NULL
);

-- Tabela de Pagamentos
CREATE TABLE pagamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  instrutor_id UUID REFERENCES instrutores(id),
  tipo VARCHAR(50) NOT NULL, -- assinatura, destaque
  descricao VARCHAR(255),
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, pago, falhou
  stripe_payment_id VARCHAR(255),
  metodo VARCHAR(20) -- cartao, pix, boleto
);

-- Índices para performance
CREATE INDEX idx_instrutores_estado ON instrutores(estado);
CREATE INDEX idx_instrutores_cidade ON instrutores(cidade);
CREATE INDEX idx_instrutores_plano ON instrutores(plano);
CREATE INDEX idx_instrutores_status ON instrutores(status);
```

### Passo 3: Obter credenciais
1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...`
3. Guarde essas informações!

---

## 4. Configurando o Stripe

### Passo 1: Criar conta
1. Acesse: https://stripe.com/br
2. Clique em "Começar agora"
3. Preencha seus dados empresariais
4. Complete a verificação

### Passo 2: Configurar produtos (no Dashboard do Stripe)

Vá em **Products** > **Add product** e crie:

#### Produto 1: Plano Profissional
- **Name**: Plano Profissional
- **Price**: R$ 49,90 / mês (recurring)
- **Price ID**: (anote o ID gerado)

#### Produto 2: Plano Premium
- **Name**: Plano Premium
- **Price**: R$ 99,90 / mês (recurring)
- **Price ID**: (anote o ID gerado)

#### Produto 3: Plano Escola
- **Name**: Plano Escola/CFC
- **Price**: R$ 299,90 / mês (recurring)
- **Price ID**: (anote o ID gerado)

#### Produto 4: Destaque 7 dias
- **Name**: Destaque 7 dias
- **Price**: R$ 29,90 (one-time)
- **Price ID**: (anote o ID gerado)

#### Produto 5: Destaque 15 dias
- **Name**: Destaque 15 dias
- **Price**: R$ 49,90 (one-time)
- **Price ID**: (anote o ID gerado)

#### Produto 6: Destaque 30 dias
- **Name**: Destaque 30 dias
- **Price**: R$ 79,90 (one-time)
- **Price ID**: (anote o ID gerado)

### Passo 3: Configurar PIX
1. Vá em **Settings** > **Payment methods**
2. Ative **PIX** (Stripe suporta PIX no Brasil)
3. Configure o webhook para receber notificações

### Passo 4: Obter credenciais
1. Vá em **Developers** > **API keys**
2. Copie:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`
3. Guarde em lugar seguro!

### Passo 5: Configurar Webhook
1. Vá em **Developers** > **Webhooks**
2. Adicione endpoint: `https://xxxxx.supabase.co/functions/v1/stripe-webhook`
3. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

---

## 5. Produtos e Planos

### Tabela de Funcionalidades por Plano

| Funcionalidade | Gratuito | Profissional | Premium | Escola |
|----------------|----------|--------------|---------|--------|
| Perfil na plataforma | ✅ | ✅ | ✅ | ✅ |
| Contatos/mês | 5 | Ilimitado | Ilimitado | Ilimitado |
| Selo verificado | ❌ | ✅ | ✅ | ✅ |
| Estatísticas | ❌ | ✅ | ✅ | ✅ |
| Foto em destaque | ❌ | ✅ | ✅ | ✅ |
| Topo das buscas | ❌ | ❌ | ✅ | ✅ |
| Página personalizada | ❌ | ❌ | ✅ | ✅ |
| Selo Premium dourado | ❌ | ❌ | ✅ | ✅ |
| Múltiplos instrutores | ❌ | ❌ | ❌ | Até 10 |
| Dashboard admin | ❌ | ❌ | ❌ | ✅ |
| API integração | ❌ | ❌ | ❌ | ✅ |
| Suporte prioritário | ❌ | ❌ | ✅ | ✅ |

### Alterando Preços
Para alterar preços:
1. Acesse o Dashboard do Stripe
2. Vá em **Products**
3. Edite o produto desejado
4. Crie um novo preço (mantenha o antigo para assinantes existentes)
5. Atualize o código do site com o novo Price ID

---

## 6. Gerenciando Instrutores

### Acessar o painel do Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto "conectahabilitacao"
3. Vá em **Table Editor**

### Aprovar um instrutor
1. Vá na tabela `instrutores`
2. Encontre o instrutor pelo nome ou email
3. Altere:
   - `status`: de `pendente` para `ativo`
   - `verificado`: para `true` (se verificou os documentos)

### Suspender um instrutor
1. Encontre o instrutor
2. Altere `status` para `suspenso`

### Aplicar destaque manual
1. Encontre o instrutor
2. Altere `destaque_ate` para a data final do destaque

### Verificar métricas
- `visualizacoes`: quantas vezes o perfil foi visto
- `contatos_mes`: quantos contatos recebeu no mês
- `avaliacao_media`: nota média das avaliações

---

## 7. Gerenciando Alunos

### Ver alunos cadastrados
1. Vá na tabela `alunos` no Supabase
2. Você verá todos os alunos que se cadastraram

### Ver contatos realizados
1. Vá na tabela `contatos`
2. Veja quem contatou quem e quando

### Moderar avaliações
1. Vá na tabela `avaliacoes`
2. Altere `aprovado` para `true` para publicar
3. Delete avaliações inadequadas

---

## 8. Atualizando o Site

### Método 1: Pelo GitHub (Recomendado)
1. Edite os arquivos no GitHub
2. Faça commit das alterações
3. O Netlify faz deploy automático

### Método 2: Edição local
1. Edite os arquivos em `C:\Users\Dell\.openclaw\workspace\instrutores-connect`
2. No terminal, execute:
   ```bash
   cd C:\Users\Dell\.openclaw\workspace\instrutores-connect
   git add .
   git commit -m "Descrição da alteração"
   git push
   ```
3. O Netlify faz deploy automático

### Arquivos principais
| Arquivo | O que alterar |
|---------|---------------|
| `index.html` | Conteúdo da página principal |
| `styles.css` | Cores, fontes, espaçamentos |
| `app.js` | Funcionalidades e lógica |
| `login.html` | Página de login |

### Alterações comuns

#### Mudar cores do site
No arquivo `styles.css`, procure por `:root` e altere as variáveis:
```css
:root {
  --primary: #seu-novo-cor;
  --secondary: #sua-cor-secundaria;
}
```

#### Mudar textos
Edite diretamente no `index.html`

#### Mudar preços exibidos
Procure pelos valores no `index.html` e altere

---

## 9. Monitoramento e Relatórios

### Netlify Analytics
1. Acesse: https://app.netlify.com/projects/conectahabilitacao-app
2. Vá em **Logs & metrics**
3. Veja:
   - Número de visitantes
   - Páginas mais acessadas
   - Erros

### Supabase Dashboard
1. Acesse o projeto no Supabase
2. Veja:
   - Número de registros por tabela
   - Uso do banco de dados
   - Logs de autenticação

### Stripe Dashboard
1. Acesse: https://dashboard.stripe.com
2. Veja:
   - Receita total
   - Assinaturas ativas
   - Pagamentos recebidos
   - Churn (cancelamentos)

### Relatório mensal sugerido
- [ ] Total de instrutores cadastrados
- [ ] Novos cadastros no mês
- [ ] Instrutores por plano (gratuito/pago)
- [ ] Receita do mês
- [ ] Taxa de conversão (gratuito → pago)
- [ ] Avaliações recebidas

---

## 10. Troubleshooting

### Site fora do ar
1. Acesse: https://app.netlify.com/projects/conectahabilitacao-app/deploys
2. Verifique se o último deploy teve erro
3. Se sim, clique no deploy para ver o log de erro

### Pagamento não processou
1. Acesse o Dashboard do Stripe
2. Vá em **Payments**
3. Encontre o pagamento e veja o status
4. Verifique se o webhook está funcionando

### Instrutor não aparece na busca
Verifique no Supabase:
1. `status` deve ser `ativo`
2. `verificado` deve ser `true`

### Erro ao fazer login
1. Verifique se o email existe na tabela `instrutores`
2. Verifique os logs de autenticação no Supabase

### Precisa de ajuda?
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Netlify**: https://docs.netlify.com

---

## Próximos Passos

1. [ ] Criar conta no Supabase
2. [ ] Executar os scripts SQL para criar tabelas
3. [ ] Criar conta no Stripe
4. [ ] Cadastrar os produtos no Stripe
5. [ ] Integrar Supabase no código do site
6. [ ] Integrar Stripe no código do site
7. [ ] Testar todo o fluxo
8. [ ] Lançar!

---

*Manual criado em 06/02/2026*
*Versão 1.0*
