# 🚀 Guia de Deploy - Sistema de Avaliações Corrigido

## 📋 Mudanças Implementadas

### Arquivos Modificados

1. **`src/app.js`** - Configuração CORS aprimorada
2. **`src/config/db.js`** - Conexão MongoDB mais robusta
3. **`public/user-reviews.js`** - Detecção de ambiente corrigida e melhor tratamento de erros

### Novos Arquivos

1. **`test-reviews-endpoint.js`** - Script de testes completo
2. **`REVIEWS-IMPLEMENTATION.md`** - Documentação técnica
3. **`DEPLOY-GUIDE.md`** - Este arquivo

## 🔧 Pré-requisitos no Render

### 1. Variáveis de Ambiente

Acesse o dashboard do Render → Seu serviço → **Environment**

Adicione/verifique estas variáveis:

```
MONGO_URI=mongodb+srv://eliswilliam01_db_user:3tIISQncqmDUqGBR@cluster0.trlxihj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

PORT=3001
NODE_ENV=production
```

⚠️ **IMPORTANTE:** Nunca commite o arquivo `.env` no Git!

### 2. MongoDB Atlas - Network Access

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Vá em **Network Access** (menu lateral esquerdo)
3. Clique em **+ ADD IP ADDRESS**
4. Selecione **ALLOW ACCESS FROM ANYWHERE** (0.0.0.0/0)
5. Ou adicione o IP específico do Render

> **Por quê?** O Render não tem IP fixo, então é mais fácil permitir todos os IPs. 
> Para produção real, considere usar MongoDB Atlas Private Endpoint.

### 3. Build Command (se necessário)

No Render, verifique se o **Build Command** está correto:

```bash
npm install
```

### 4. Start Command

Verifique se o **Start Command** está:

```bash
node src/app.js
```

## 📤 Processo de Deploy

### Opção 1: Deploy Automático (Recomendado)

Se você configurou deploy automático no Render:

```bash
# 1. Adicione todos os arquivos modificados
git add src/app.js src/config/db.js public/user-reviews.js

# 2. Adicione os novos arquivos de documentação
git add test-reviews-endpoint.js REVIEWS-IMPLEMENTATION.md DEPLOY-GUIDE.md

# 3. Commit com mensagem descritiva
git commit -m "fix: Corrigir sistema de avaliações para funcionar no Render

- Configurar CORS para aceitar requisições do domínio Render
- Melhorar conexão MongoDB com timeouts apropriados
- Corrigir detecção de ambiente no frontend
- Adicionar tratamento de erros robusto
- Criar testes completos do sistema de reviews"

# 4. Push para GitHub
git push origin main
```

O Render detectará o push e iniciará o deploy automaticamente.

### Opção 2: Deploy Manual

1. Acesse o dashboard do Render
2. Selecione seu serviço
3. Clique em **Manual Deploy** → **Deploy latest commit**

## ✅ Verificação Pós-Deploy

### 1. Verificar Logs do Render

Acesse **Logs** no dashboard do Render e procure por:

```
✅ MongoDB connecté avec succès
📊 Base de dados: test
🚀 Serveur démarré sur http://localhost:XXXX
```

Se você ver esses logs, está tudo funcionando! ✅

### 2. Testar a API Diretamente

**Teste 1: Health Check**
```bash
curl https://cinemaf.onrender.com/health
```

Resposta esperada:
```json
{"status":"ok","time":"2025-11-05T..."}
```

**Teste 2: Buscar Reviews (mesmo sem reviews)**
```bash
curl https://cinemaf.onrender.com/api/reviews/550
```

Resposta esperada:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

**Teste 3: Criar uma Review**
```bash
curl -X POST https://cinemaf.onrender.com/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "550",
    "username": "Deploy Test",
    "rating": 5,
    "comment": "Testando o sistema de avaliações após deploy no Render!"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Avaliação criada com sucesso",
  "data": {
    "_id": "...",
    "movieId": "550",
    "username": "Deploy Test",
    "rating": 5,
    "comment": "Testando...",
    "date": "..."
  }
}
```

### 3. Testar no Navegador

1. Acesse https://cinemaf.onrender.com
2. Navegue até a página de detalhes de um filme
3. Abra o DevTools (F12) → Console
4. Procure pelos logs:

```
🌐 Detecção de ambiente: { hostname: 'cinemaf.onrender.com', ... }
✅ Mode Production: API = https://cinemaf.onrender.com/api/reviews
📡 Carregando avaliações do filme...
```

5. Tente adicionar uma avaliação:
   - Selecione de 1 a 5 estrelas
   - Escreva um comentário (mínimo 10 caracteres)
   - Clique em "Publicar Avaliação"

6. Verifique se aparece:
   - Notificação de sucesso
   - A nova avaliação aparece na lista

## 🐛 Troubleshooting

### Problema: "MongoDB connection failed"

**Sintoma:** Logs mostram erro de conexão MongoDB

**Solução:**
1. Verifique se `MONGO_URI` está correta no Render
2. Confirme que MongoDB Atlas permite conexões de todos os IPs (0.0.0.0/0)
3. Verifique se a senha não contém caracteres especiais que precisam ser encoded

### Problema: "CORS error" no navegador

**Sintoma:** Console mostra "Access to fetch blocked by CORS policy"

**Solução:**
1. Confirme que o código atualizado foi deployado
2. Limpe o cache do navegador (Ctrl + Shift + Delete)
3. Verifique se `src/app.js` tem a nova configuração CORS

### Problema: Reviews aparecem mas não salvam

**Sintoma:** Review aparece na tela mas desaparece ao recarregar

**Solução:**
1. Isso indica que o frontend está usando localStorage (fallback)
2. Verifique os logs do navegador para ver o erro exato
3. Provavelmente é um problema de conexão com o backend

### Problema: "Cannot GET /"

**Sintoma:** Ao acessar `https://cinemaf.onrender.com` aparece erro 404

**Solução:**
1. Isso é normal se não houver arquivo `index.html` na raiz
2. Acesse diretamente: `https://cinemaf.onrender.com/home.html`
3. Ou crie um `index.html` que redireciona para `home.html`

## 📊 Monitoramento

### Logs Importantes para Monitorar

```bash
# MongoDB conectado
✅ MongoDB connecté avec succès

# Servidor iniciado
🚀 Serveur démarré sur http://localhost:XXXX

# Requisição recebida
📨 POST /api/reviews

# Review criada
✅ Avaliação criada com sucesso
```

### Ferramentas de Monitoramento

- **Render Dashboard:** Mostra uso de CPU, memória, logs
- **MongoDB Atlas:** Mostra conexões ativas, queries, uso de storage
- **Browser DevTools:** Mostra requisições, respostas, erros

## 🎯 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] ✅ Variáveis de ambiente configuradas no Render
- [ ] ✅ MongoDB Atlas permite conexões do Render
- [ ] ✅ Código commitado e pushed para GitHub
- [ ] ✅ Deploy concluído sem erros
- [ ] ✅ Logs mostram MongoDB conectado
- [ ] ✅ API `/health` responde corretamente
- [ ] ✅ API `/api/reviews/:movieId` funciona
- [ ] ✅ Possível criar review via `POST /api/reviews`
- [ ] ✅ Frontend detecta ambiente corretamente
- [ ] ✅ Reviews são exibidas na página
- [ ] ✅ Possível adicionar review via interface

## 🎉 Sucesso!

Se todos os checkpoints acima estão ✅, seu sistema de avaliações está funcionando perfeitamente tanto em desenvolvimento quanto em produção!

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs do Render** para ver exatamente qual erro está acontecendo
2. **Use o DevTools do navegador** (F12 → Console) para ver erros frontend
3. **Teste os endpoints manualmente** com curl/Postman
4. **Revise a documentação:** `REVIEWS-IMPLEMENTATION.md`

## 🔄 Próximas Melhorias Sugeridas

1. ⭐ Adicionar autenticação JWT para reviews
2. ⭐ Implementar sistema de moderação
3. ⭐ Rate limiting para prevenir spam
4. ⭐ Paginação para muitas reviews
5. ⭐ Sistema de likes/reports em reviews
6. ⭐ Webhook para notificar moderadores
7. ⭐ Analytics de reviews (filmes mais comentados, etc)

---

**Data do Deploy:** _[Anote aqui quando fizer o deploy]_  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para produção
