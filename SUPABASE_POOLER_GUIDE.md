# Configuração do Supabase Session Pooler

## Problema

O Supabase free tier não é compatível com IPv4 por padrão, causando erro:

```
connect ENETUNREACH 2600:1f16:... - Local (:::0)
```

## Solução: Session Pooler

### 1. Obter URL do Session Pooler

No dashboard do Supabase:

1. Projeto → Settings → Database
2. Connection Parameters
3. Copie a URL do **Session pooler** (não a Direct connection)

### 2. Identificar a Diferença

```bash
# ❌ Direct connection (problemática)
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# ✅ Session pooler (funciona no Render)
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:6543/postgres
```

**Diferença principal: porta 6543 em vez de 5432**

### 3. Configurar no Render

1. Dashboard do Render → Seu backend service
2. Settings → Environment Variables
3. Editar `DATABASE_URL`
4. **Trocar `:5432` por `:6543`**
5. Save Changes (vai fazer redeploy automático)

### 4. Verificar Conexão

Após redeploy, verificar logs do Render para:

```
Database connected successfully at: [timestamp]
```

### 5. Benefícios do Session Pooler

- ✅ Compatibilidade IPv4
- ✅ Melhor performance com conexões pooled
- ✅ Reduz timeout de conexões
- ✅ Mantém o Supabase free tier

### 6. Limitações

- Máximo 15 conexões simultâneas no free tier
- Timeout de 300 segundos por query
- Algumas extensões podem não funcionar

## Troubleshooting

Se ainda houver problemas:

1. Verificar se a URL está correta
2. Verificar se a extensão pgvector está habilitada
3. Testar conexão local com a nova URL
