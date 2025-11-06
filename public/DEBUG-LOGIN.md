# 🔍 Debug do Problema de Login

## Problema Relatado
"Failed to login" ao tentar fazer login no frontend.

## ✅ Verificações Realizadas

### 1. Backend
- ✅ **Backend está ONLINE**: `https://cinemaf.onrender.com`
- ✅ **Health endpoint funciona**: `/health` retorna status 200
- ✅ **Login endpoint funciona**: `/api/users/login` aceita credenciais e retorna token
- ✅ **CORS configurado corretamente**: Headers presentes

### 2. Frontend
- ✅ **Arquivo `config.js`**: CONFIG está correto
- ✅ **Arquivo `auth.js`**: Funções de autenticação OK
- ✅ **Arquivo `main.js`**: Lógica de login implementada
- ✅ **Funções auxiliares**: `showSpinner`, `notify` presentes

## 🐛 Possíveis Causas do Problema

### Causa #1: Arquivo `notifications.js` não carregado
**Sintoma**: Erro `notify is not defined`

**Verificar**:
```javascript
// Abra o DevTools (F12) e execute:
typeof notify
// Deve retornar: "object"
```

**Solução**: Verificar se `notifications.js` está sendo carregado ANTES de `main.js` no HTML

### Causa #2: Ordem de carregamento dos scripts
**Problema**: Se `main.js` carregar antes de `config.js` ou `notifications.js`, as funções não estarão disponíveis

**Solução**: Ordem correta em `login.html`:
```html
<script src="notifications.js"></script>
<script src="auth.js"></script>
<script src="config.js"></script>
<script src="main.js"></script>
```

### Causa #3: Cache do navegador
**Problema**: Navegador está usando versões antigas dos arquivos

**Solução**:
1. Abra DevTools (F12)
2. Vá em Application > Clear storage
3. Clique em "Clear site data"
4. Recarregue a página com Ctrl+Shift+R

### Causa #4: Credenciais inválidas
**Problema**: Email/senha não existem no banco de dados

**Solução**:
1. Primeiro, crie uma conta no cadastro
2. Depois tente fazer login com as mesmas credenciais

### Causa #5: Erro de rede/timeout
**Problema**: Request demora muito e dá timeout

**Solução**:
1. Verificar conexão com internet
2. Aumentar timeout em `config.js`:
   ```javascript
   SETTINGS: {
     REQUEST_TIMEOUT: 30000, // 30 segundos
     PASSWORD_MIN_LENGTH: 6,
     CODE_LENGTH: 6
   }
   ```

## 🔧 Ferramenta de Debug

Criamos uma página especial para debug: `test-login-debug.html`

**Como usar**:
1. Abra `http://127.0.0.1:5500/test-login-debug.html` (ou o caminho correto no seu servidor)
2. Clique em "Verificar CONFIG"
3. Clique em "Testar Backend Health"
4. Digite email e senha de teste
5. Clique em "Login Verbose"
6. Analise os logs detalhados

## 📋 Checklist de Diagnóstico

Execute na console do navegador (F12 > Console):

```javascript
// 1. Verificar se CONFIG existe
console.log('CONFIG:', CONFIG);

// 2. Verificar se notify existe
console.log('notify:', typeof notify);

// 3. Verificar se getApiUrl funciona
console.log('Login URL:', getApiUrl('LOGIN'));

// 4. Testar login manualmente
fetch(getApiUrl('LOGIN'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
})
.then(r => r.json())
.then(d => console.log('Resposta:', d))
.catch(e => console.error('Erro:', e));

// 5. Verificar localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('Email:', localStorage.getItem('userEmail'));
```

## 🎯 Solução Rápida

**Se nada funcionar**, aplique este patch no `main.js`:

Substitua a seção de login (linha ~206-280) por:

```javascript
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('🚀 Login iniciado');

    const emailInput = loginForm.querySelector('input[type="email"], input[type="text"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const submitBtn = loginForm.querySelector('.submit-btn');

    if (!emailInput || !passwordInput || !submitBtn) {
      console.error('❌ Elementos do formulário não encontrados');
      alert('Erro: Formulário inválido');
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      // Mostrar loading
      if (typeof showSpinner === 'function') {
        showSpinner(submitBtn, true);
      } else {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Carregando...';
      }

      console.log('📡 Fazendo request para:', getApiUrl('LOGIN'));

      const response = await fetch(getApiUrl('LOGIN'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📥 Resposta recebida:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro do servidor:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Login bem-sucedido:', data);

      // Salvar dados
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      
      // Notificar sucesso
      if (typeof notify !== 'undefined' && notify.success) {
        notify.success('Bem-vindo!', 'Login realizado com sucesso');
      } else {
        alert('Login realizado com sucesso!');
      }
      
      // Redirecionar
      setTimeout(() => {
        window.location.href = 'profil.html';
      }, 400);
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // Mostrar erro
      if (typeof notify !== 'undefined' && notify.error) {
        notify.error('Erro no login', error.message);
      } else {
        alert('Erro no login: ' + error.message);
      }
      
      // Esconder loading
      if (typeof showSpinner === 'function') {
        showSpinner(submitBtn, false);
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
      }
    }
  });
} else {
  console.error('❌ Formulário de login não encontrado!');
}
```

## 📞 Próximos Passos

1. Abra `test-login-debug.html` no navegador
2. Execute os testes
3. Copie os logs da console
4. Analise onde está falhando exatamente

## 🆘 Se ainda não funcionar

Crie uma conta de teste primeiro:
1. Vá para a aba "Cadastro"
2. Use: `test@test.com` / `test123`
3. Cadastre
4. Depois tente fazer login com as mesmas credenciais
