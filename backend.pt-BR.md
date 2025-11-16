# 🚀 DOCUMENTAÇÃO BACKEND - CINEHOME (Português - BR)

## 📋 Sumário

1. [Visão geral](#visão-geral)
2. [Tecnologias utilizadas](#tecnologias-utilizadas)
3. [Arquitetura](#arquitetura)
4. [Configuração](#configuração)
5. [Banco de dados](#banco-de-dados)
6. [Endpoints da API](#endpoints-da-api)
7. [Autenticação](#autenticação)
8. [Serviços](#serviços)
9. [Segurança](#segurança)
10. [Deploy / Implantação](#deploy)

---

## 🎯 Visão geral

O backend do CINEHOME é uma API RESTful construída com Node.js e Express, oferecendo serviços de autenticação, gerenciamento de usuários, avaliações (reviews) de filmes e integração com serviços externos (Google OAuth, TMDB, Groq AI).

### Principais funcionalidades
- ✅ **Autenticação JWT** com bcrypt para hashing
- ✅ **Google OAuth 2.0** para login social
- ✅ **MongoDB Atlas** para persistência de dados
- ✅ **Envio de emails** com Nodemailer (recuperação de senha)
- ✅ **API TMDB** para busca de filmes
- ✅ **Chatbot Groq AI** para assistência ao usuário
- ✅ **CORS configurado** para o frontend
- ✅ **Variáveis de ambiente** para segurança

---

## 🛠️ Tecnologias utilizadas

### **Framework principal**
```json
{
  "express": "^5.1.0"  // Framework web Node.js
}
```
- **Express.js 5.x** - framework minimalista e flexível para Node.js
- Gerenciamento de rotas, middlewares e HTTP
- Suporte nativo a Promises e async/await
- Performance otimizada

### **Banco de dados**
```json
{
  "mongoose": "^8.19.1"  // ODM MongoDB
}
```
- **MongoDB Atlas** - banco NoSQL na nuvem
- **Mongoose 8.x** - ODM (Object Document Mapper) para MongoDB
- Schemas tipados e validação de dados
- Middlewares pre/post hooks
- Conexão segura via URI

### **Autenticação & Segurança**
```json
{
  "bcryptjs": "^3.0.2",           // Hashing de senhas
  "jsonwebtoken": "^9.0.2",       // Geração/validação JWT
  "google-auth-library": "^10.4.1" // OAuth Google
}
```

#### **bcryptjs**
- Hash de senha seguro
- Salt automático (10 rounds por padrão)
- Resistente a ataques por força bruta
- Comparação segura dos hashes

**Uso:**
```javascript
const bcrypt = require('bcryptjs');

// Hash da senha ao criar usuário
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Verificação no login
const isMatch = await bcrypt.compare(password, user.password);
```

#### **jsonwebtoken (JWT)**
- Tokens stateless para autenticação
- Assinatura com secret (HS256)
- Expiração configurável (1h por padrão)
- Payload personalizável

**Uso:**
```javascript
const jwt = require('jsonwebtoken');

// Geração do token
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verificação do token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### **google-auth-library**
- OAuth 2.0 para Google Sign-In
- Verificação de ID tokens
- Recuperação de informações do usuário
- Suporte a refresh token

### **Comunicação HTTP**
```json
{
  "axios": "^1.12.2",  // Cliente HTTP
  "cors": "^2.8.5"     // Cross-Origin Resource Sharing
}
```

#### **axios**
- Requisições HTTP para APIs externas (TMDB, Google)
- Suporte a interceptores
- Transformação automática JSON
- Gerenciamento de timeouts

#### **cors**
- Autoriza requisições cross-origin
- Configuração flexível por origem
- Suporte a credentials (cookies)
- Cabeçalhos personalizados

**Configuração:**
```javascript
app.use(cors({
  origin: true,       // Autoriza todas as origens
  credentials: true,  // Autoriza cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));
```

### **Serviços externos**
```json
{
  "nodemailer": "^7.0.9",  // Envio de emails
  "groq-sdk": "^0.34.0"    // IA conversacional
}
```

#### **nodemailer**
- Envio de emails transacionais
- Suporte Gmail, SMTP, etc.
- Templates HTML/texto
- Gestão de anexos

**Uso:**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

await transporter.sendMail({
  from: '"CINEHOME" <noreply@cinehome.com>',
  to: userEmail,
  subject: 'Código de verificação',
  html: `<p>Seu código: <strong>${code}</strong></p>`
});
```

#### **groq-sdk**
- Chatbot IA com Groq
- Modelos LLM otimizados
- Streaming de respostas
- Context awareness

### **Configuração**
```json
{
  "dotenv": "^17.2.3"  // Variáveis de ambiente
}
```

#### **dotenv**
- Carrega variáveis de `.env`
- Separação entre configuração e código
- Segurança das credenciais
- Multi-ambientes (dev/prod)

---

## 🏗️ Arquitetura

### Estrutura de pastas
```
src/
├── app.js                      # Ponto de entrada principal
├── config/
│   └── db.js                   # Configuração do MongoDB
├── controllers/
│   ├── userControllers.js      # Lógica de negócio dos usuários
│   └── reviewController.js     # Lógica de negócio das avaliações
├── models/
│   ├── userModel.js            # Schema MongoDB User
│   └── reviewModel.js          # Schema MongoDB Review
├── routes/
│   ├── userRoutes.js           # Rotas API usuários
│   └── reviewRoutes.js         # Rotas API reviews
├── services/
│   └── emailService.js         # Serviço de envio de emails
└── email.js                    # Rotas OAuth Google
```

### Padrão MVC (Model-View-Controller)
```
┌─────────────┐
│   Cliente   │  (Frontend)
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│   Rotas     │  Roteamento dos endpoints
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  Lógica de negócio
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │  Schemas de dados
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │  Banco de dados
└─────────────┘
```

### Fluxo de requisição típico

**Exemplo: Login de usuário**
```
1. POST /api/users/login
   ↓
2. userRoutes.js → Roteia para o controller
   ↓
3. userControllers.js → login()
   ↓
4. Busca o usuário no MongoDB
   ↓
5. Verificação com bcrypt da senha
   ↓
6. Geração do JWT
   ↓
7. Resposta JSON { token, message }
```

---

## ⚙️ Configuração

### Variáveis de ambiente (.env)

```bash
# MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/cinehome?retryWrites=true&w=majority

# JWT Secret (gerar com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=seu_secret_jwt_muito_seguro_minimo_32_caracteres

# Email (Gmail)
EMAIL_USER=seu.email@gmail.com
EMAIL_PASSWORD=sua_senha_de_aplicativo

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=https://cinemaf.onrender.com/auth/google/callback
GOOGLE_LOGIN_CALLBACK_URL=https://cinemaf.onrender.com/auth/google/login/callback

# Frontend
FRONTEND_LOGIN_URL=https://cinemaf.onrender.com/profil.html

# Server
PORT=3001
NODE_ENV=production
```

### Configuração por ambiente

**Desenvolvimento local:**
```bash
API_BASE_URL=http://localhost:3001
FRONTEND_LOGIN_URL=http://localhost:3001/profil.html
```

**Produção (Render):**
```bash
API_BASE_URL=https://cinemaf.onrender.com
FRONTEND_LOGIN_URL=https://cinemaf.onrender.com/profil.html
```

---

## 💾 Banco de dados

### MongoDB Atlas

**Conexão:**
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### Schema User (`userModel.js`)

```javascript
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  createdViaOAuth: { 
    type: Boolean, 
    default: false 
  },
  oauthProvider: { 
    type: String, 
    enum: ['google', 'github', null], 
    default: null 
  }
}, {
  timestamps: true  // createdAt, updatedAt automáticos
});

// Middleware: Hash da senha antes do save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

### Schema Review (`reviewModel.js`)

```javascript
const reviewSchema = new mongoose.Schema({
  movieId: { 
    type: Number, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  userEmail: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Índice para consultas rápidas
reviewSchema.index({ movieId: 1, userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
```

---

## 🔌 Endpoints da API

### **Autenticação de usuário**

#### `POST /api/users/register`
Cadastro de novo usuário.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "_id": "673c5507...",
    "email": "user@example.com",
    "createdViaOAuth": false,
    "createdAt": "2025-11-07T10:30:00.000Z"
  }
}
```

**Erros:**
- `400` - Usuário já existente
- `500` - Erro de servidor

---

#### `POST /api/users/login`
Login de usuário existente.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Resposta (200):**
```json
{
  "message": "Login bem-sucedido",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros:**
- `404` - Usuário não encontrado
- `401` - Senha incorreta
- `500` - Erro de servidor

---

#### `POST /api/users/forgot-password`
Solicitação de redefinição de senha.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Resposta (200):**
```json
{
  "message": "Código enviado com sucesso",
  "expiresIn": "10 minutos",
  "code": "123456"  // Somente em modo dev
}
```

**Processo:**
1. Geração de um código de 6 dígitos
2. Armazenamento em memória (Map) com expiração de 10 min
3. Envio do código por email
4. Retorno da confirmação

---

#### `POST /api/users/verify-reset-code`
Verificação do código de redefinição.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Resposta (200):**
```json
{
  "message": "Código verificado com sucesso",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros:**
- `400` - Código inválido, expirado ou não encontrado

---

#### `POST /api/users/reset-password`
Redefinição da senha usando o token.

**Request:**
```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewSecurePassword123!"
}
```

**Resposta (200):**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

---

#### `POST /api/users/change-password`
Alteração de senha (usuário autenticado).

**Request:**
```json
{
  "email": "user@example.com",
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Resposta (200):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Erros:**
- `400` - Nova senha igual à antiga
- `401` - Senha atual incorreta
- `404` - Usuário não encontrado

---

### **Google OAuth**

#### `GET /auth/google/login`
Inicia o fluxo OAuth do Google para login.

**Redirecionamento para:**
```
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=...&
  redirect_uri=...&
  response_type=code&
  scope=email+profile
```

---

#### `GET /auth/google/login/callback`
Callback após autenticação no Google.

**Processo:**
1. Recupera o código de autorização
2. Troca código → access_token
3. Recupera informações do usuário no Google
4. Busca ou cria o usuário na base
5. Gera JWT
6. Redireciona para o frontend com o token

**Redirecionamento final:**
```
https://cinemaf.onrender.com/profil.html?token=JWT&email=user@example.com
```

---

### **Reviews (Avaliações de usuários)**

#### `POST /api/reviews`
Criar uma review para um filme.

**Request:**
```json
{
  "movieId": 550,
  "userEmail": "user@example.com",
  "rating": 5,
  "comment": "Filme incrível! Uma obra-prima absoluta."
}
```

**Resposta (201):**
```json
{
  "message": "Review criada com sucesso",
  "review": {
    "_id": "673c5507...",
    "movieId": 550,
    "rating": 5,
    "comment": "Filme incrível!",
    "createdAt": "2025-11-07T10:30:00.000Z"
  }
}
```

---

#### `GET /api/reviews/:movieId`
Recuperar todas as reviews de um filme.

**Resposta (200):**
```json
{
  "reviews": [
    {
      "_id": "673c5507...",
      "userEmail": "user@example.com",
      "rating": 5,
      "comment": "Filme incrível!",
      "createdAt": "2025-11-07T10:30:00.000Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 42
}
```

---

#### `PUT /api/reviews/:id`
Modificar uma review existente.

**Request:**
```json
{
  "rating": 4,
  "comment": "Depois de pensar, foi muito bom."
}
```

---

#### `DELETE /api/reviews/:id`
Excluir uma review.

**Resposta (200):**
```json
{
  "message": "Review deletada com sucesso"
}
```

---

### **Busca TMDB**

#### `GET /api/tmdb/search?query=Matrix`
Busca filmes via TMDB.

**Resposta (200):**
```json
{
  "results": [
    {
      "id": 603,
      "title": "The Matrix",
      "poster_path": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      "vote_average": 8.2,
      "release_date": "1999-03-30"
    }
  ],
  "total_results": 156
}
```

---

### **Chatbot Groq AI**

#### `POST /api/chat`
Conversa com o chatbot IA.

**Request:**
```json
{
  "message": "Me recomende um filme de ficção científica"
}
```

**Resposta (200):**
```json
{
  "response": "Recomendo 'Blade Runner 2049'! É uma obra-prima visual..."
}
```

---

### **Health Check**

#### `GET /health`
Verifica o estado do servidor.

**Resposta (200):**
```json
{
  "status": "ok",
  "time": "2025-11-07T10:30:00.000Z"
}
```

---

## 🔐 Autenticação

### Fluxo JWT

```
1. User login → POST /api/users/login
   ↓
2. Verificação email/password
   ↓
3. Geração JWT com payload { id: user._id }
   ↓
4. Retorno do token ao cliente
   ↓
5. Cliente armazena token (localStorage)
   ↓
6. Requisições seguintes com header:
   Authorization: Bearer <token>
   ↓
7. Backend verifica JWT com middleware
   ↓
8. Acesso a recursos protegidos
```

### Middleware de autenticação

```javascript
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Recuperar o token do header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token ausente' });
  }
  
  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar o ID do usuário na requisição
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Uso
router.get('/profile', authMiddleware, getProfile);
```

---

## 📧 Serviços

### EmailService (`emailService.js`)

Serviço centralizado para envio de emails.

```javascript
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  async sendVerificationCode(email, code) {
    const mailOptions = {
      from: '"CINEHOME" <noreply@cinehome.com>',
      to: email,
      subject: 'Código de verificação CINEHOME',
      html: `
        <div style="font-family: Arial; max-width: 600px;">
          <h2>Redefinição de senha</h2>
          <p>Seu código de verificação:</p>
          <h1 style="color: #e50914; font-size: 32px;">${code}</h1>
          <p>Este código expira em 10 minutos.</p>
          <p>Se você não solicitou essa redefinição, ignore este email.</p>
        </div>
      `
    };
    
    return await this.transporter.sendMail(mailOptions);
  }
  
  async testEmailConfiguration() {
    try {
      await this.transporter.verify();
      console.log('✅ Configuração de email válida');
      return true;
    } catch (error) {
      console.warn('⚠️ Configuração de email inválida:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
```

---

## 🔒 Segurança

### Boas práticas implementadas

#### 1. **Hashing de senhas**
```javascript
// ✅ Uso de bcrypt com salt
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

#### 2. **JWT com expiração**
```javascript
// ✅ Tokens com tempo de vida limitado
const token = jwt.sign({ id: user._id }, JWT_SECRET, { 
  expiresIn: '1h' 
});
```

#### 3. **Variáveis de ambiente**
```javascript
// ✅ Segredos armazenados em .env
require('dotenv').config();
const secret = process.env.JWT_SECRET;
```

#### 4. **Validação de entradas**
```javascript
// ✅ Validação no servidor
if (!email || !email.includes('@')) {
  return res.status(400).json({ message: 'Email inválido' });
}

if (!password || password.length < 6) {
  return res.status(400).json({ message: 'Senha muito curta' });
}
```

#### 5. **CORS configurado**
```javascript
// ✅ Limitação de origens autorizadas
app.use(cors({
  origin: ['https://cinemaf.onrender.com'],
  credentials: true
}));
```

#### 6. **Proteção contra injeções**
```javascript
// ✅ Mongoose ajuda a sanitizar queries
const user = await User.findOne({ email });
```

#### 7. **Rate limiting** (A implementar)
```javascript
// TODO: Adicionar express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requisições
});

app.use('/api/', limiter);
```

---

## 🚀 Deploy / Implantação

### Render.com (Produção)

**Configuração:**
```yaml
# render.yaml
services:
  - type: web
    name: cinehome-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false  # Variável sensível
      - key: JWT_SECRET
        sync: false
      - key: GOOGLE_CLIENT_ID
        sync: false
```

**Configurações de build:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Versão do Node:** 18.x ou superior
- **Auto-Deploy:** ativado no push para main

### Desenvolvimento local

```bash
# Instalação
npm install

# Iniciar em modo dev (com nodemon)
npm run dev

# Iniciar em produção
npm start

# Variáveis de ambiente
cp .env.example .env
# Editar .env com seus valores
```

### Scripts em `package.json`

```json
{
  "scripts": {
    "start": "node src/app.js",        // Produção
    "dev": "nodemon src/app.js",       // Desenvolvimento
    "test": "echo \"No tests yet\""    // Testes (TODO)
  }
}
```

---

## 📊 Monitoramento & Logs

### Logging na aplicação

```javascript
// ✅ Logs estruturados com emojis
console.log('✅ MongoDB conectado');
console.error('❌ Erro de conexão:', error);
console.warn('⚠️ Configuração faltando');
console.log('📨 POST /api/users/login');
```

### Logs no Render.com
- Acessíveis via dashboard do Render
- Tempo real com `render logs`
- Filtros por nível (info, error, warn)

### Monitoramento recomendado
- **Uptime:** UptimeRobot, Pingdom
- **APM:** New Relic, Datadog
- **Errors:** Sentry
- **Analytics:** Mixpanel, Amplitude

---

## 🧪 Testes (A implementar)

### Estrutura recomendada

```
tests/
├── unit/
│   ├── models/
│   │   └── userModel.test.js
│   └── controllers/
│       └── userController.test.js
├── integration/
│   └── api/
│       ├── auth.test.js
│       └── reviews.test.js
└── e2e/
    └── user-flow.test.js
```

### Frameworks recomendados
- **Jest** - framework de testes completo
- **Supertest** - testes de API HTTP
- **MongoDB Memory Server** - banco em memória para testes

**Exemplo de teste:**
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/users/register', () => {
  it('deve criar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: 'Test123!'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('test@example.com');
  });
});
```

---

## 📝 TODOs & Melhorias

### Curto prazo
- [ ] Adicionar rate limiting com `express-rate-limit`
- [ ] Implementar testes unitários e de integração
- [ ] Adicionar validação com `joi` ou `express-validator`
- [ ] Logging com `winston` ou `pino`
- [ ] Documentação Swagger/OpenAPI

### Médio prazo
- [ ] Sistema de refresh tokens JWT
- [ ] Paginação das reviews
- [ ] Upload de avatars (AWS S3, Cloudinary)
- [ ] Webhooks para notificações
- [ ] Cache com Redis

### Longo prazo
- [ ] GraphQL em complemento ao REST
- [ ] Microservices (auth, reviews, notifications)
- [ ] WebSockets para chat em tempo real
- [ ] CI/CD com GitHub Actions
- [ ] Kubernetes para orquestração

---

## 📚 Recursos

### Documentação oficial
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Mongoose](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)

### Guias recomendados
- [REST API Best Practices](https://restfulapi.net/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [MongoDB Schema Design](https://www.mongodb.com/docs/manual/data-modeling/)

---

*Arquivo traduzido para Português (Brasil) a partir do `backend.md` original.*
