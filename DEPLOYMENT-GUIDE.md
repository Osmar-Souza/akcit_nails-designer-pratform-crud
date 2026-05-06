# 🚀 Guia de Deploy - MERN Stack Gratuito

Este guia mostra como fazer deploy de todo o projeto de forma **100% gratuita** usando MongoDB Atlas, Railway e Vercel.

## 📋 Arquitetura

```
Usuário
  ↓
Vercel (Frontend Angular)
  ↓ (HTTPS)
Railway (Backend Node.js/Express)
  ↓ (Connection String)
MongoDB Atlas (Banco de Dados)
```

---

## 1️⃣ Configurar MongoDB Atlas (Banco de Dados Gratuito)

### Passo 1: Criar conta no MongoDB Atlas
1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Clique em **"Sign Up"** (Cadastro Gratuito)
3. Preencha os dados e confirme o email

### Passo 2: Criar Cluster Gratuito
1. No dashboard, clique **"Create a Deployment"**
2. Escolha **"M0 Shared"** (Gratuito - 5GB)
3. Escolha uma region (preferencialmente próxima ao Brasil: São Paulo)
4. Clique **"Create"** e aguarde 2-3 minutos

### Passo 3: Configurar Acesso
1. Na aba **"Security"**, clique em **"Database Access"**
2. Clique **"Add New Database User"**
3. Crie um usuário:
   - Username: `akcit-user`
   - Password: Gere uma senha forte (copie em algum lugar!)
   - Role: `Atlas admin`
4. Clique **"Add User"**

### Passo 4: Permitir Conexão
1. Vá em **"Network Access"** (ainda em Security)
2. Clique **"Add IP Address"**
3. Escolha **"Allow Access from Anywhere"** (para Railway conseguir conectar)
4. Clique **"Confirm"**

### Passo 5: Obter Connection String
1. Clique **"Databases"** (no menu esquerdo)
2. Ao lado do seu cluster, clique **"Connect"**
3. Escolha **"Drivers"** → **"Node.js"** → **"3.15 or later"**
4. Copie a string (ex: `mongodb+srv://akcit-user:PASSWORD@cluster.mongodb.net/akcit-appointments?retryWrites=true&w=majority`)
5. **Substitua `<password>` pela senha que você criou**

---

## 2️⃣ Deploy Backend no Railway

### Passo 1: Preparar Repositório Git
```bash
cd c:\Users\osmar\Desktop\angular-project\akcit_nails-designer-pratform-crud
git init
git add .
git commit -m "Initial commit: MERN setup"
git remote add origin https://github.com/SEU_USUARIO/akcit-repo.git
git branch -M main
git push -u origin main
```

### Passo 2: Criar Conta Railway
1. Acesse [railway.app](https://railway.app)
2. Clique **"Sign Up"** → **"GitHub"**
3. Autorize a conexão com GitHub

### Passo 3: Deploy no Railway
1. No Railway, clique **"New Project"**
2. Escolha **"Deploy from GitHub"**
3. Selecione seu repositório `akcit-repo`
4. Railway vai automaticamente detectar Node.js

### Passo 4: Configurar Variáveis de Ambiente
1. No Railway, vá em **"Variables"** (aba no projeto)
2. Adicione:
   ```
   MONGODB_URI = mongodb+srv://akcit-user:SEU_PASSWORD@cluster.mongodb.net/akcit-appointments?retryWrites=true&w=majority
   PORT = 3333
   NODE_ENV = production
   ```
3. Clique **"Save"**

### Passo 5: Configurar Start Command
1. Vá em **"Settings"** → **"Environment"**
2. Em **"Start Command"**, coloque:
   ```
   cd backend && npm install && npm start
   ```
3. Clique **"Deploy"**

### Passo 6: Obter URL do Backend
1. Vá para aba **"Deployments"**
2. Clique no deployment ativo
3. Copie a URL (ex: `https://akcit-backend-production-xyz.railway.app`)
4. **Guarde essa URL!**

---

## 3️⃣ Deploy Frontend no Vercel

### Passo 1: Build do Angular
```bash
npm run build
```
Isso vai gerar a pasta `dist/angular-project/`

### Passo 2: Criar Conta Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique **"Sign Up"** → **"GitHub"**
3. Autorize a conexão

### Passo 3: Configurar Variável do Backend
1. Antes de fazer deploy, abra [src/app/appointment.service.ts](../src/app/appointment.service.ts)
2. Substitua:
   ```typescript
   : (window as any).__API_URL__ || 'https://seu-backend-railway.railway.app';
   ```
   Pela URL real do Railroad que você copiou no Passo 6 acima:
   ```typescript
   : (window as any).__API_URL__ || 'https://akcit-backend-production-xyz.railway.app';
   ```
3. Faça commit:
   ```bash
   git add src/app/appointment.service.ts
   git commit -m "Update backend API URL for production"
   git push
   ```

### Passo 4: Deploy no Vercel
1. No Vercel, clique **"New Project"**
2. Selecione seu repositório GitHub
3. Vercel vai automaticamente detectar **Angular**
4. Aceite os default settings e clique **"Deploy"**
5. Aguarde 2-5 minutos

### Passo 5: Seu app está online!
Você vai receber uma URL (ex: `https://akcit-platform.vercel.app`)

---

## 🔗 Configurar CORS (se necessário)

Se receber erro de CORS, adicione ao `backend/server.js`:

```javascript
app.use(cors({ 
  origin: ['https://seu-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true 
}));
```

Depois atualize e faça push:
```bash
git add backend/server.js
git commit -m "Fix CORS for production"
git push
```

Railway vai automaticamente fazer redeploy! 🎉

---

## 💰 Custos (Sim, é GRATUITO!)

| Serviço | Plano | Preço |
|---------|-------|-------|
| **MongoDB Atlas** | M0 Shared | **Grátis** ✅ |
| **Railway** | Starter (5GB/mês) | **Grátis** ✅ |
| **Vercel** | Hobbyist | **Grátis** ✅ |
| **Total** | - | **$0/mês** 💰 |

---

## 🐛 Troubleshooting

### Backend não conecta ao MongoDB
- Verifique se adicionou o IP do Railway em "Network Access"
- Confirme que a senha está correta em `MONGODB_URI`
- Teste a connection string localmente primeiro:
  ```bash
  mongosh "mongodb+srv://akcit-user:PASSWORD@..."
  ```

### Frontend não conecta ao Backend
- Confirme que a URL do Railway está correta em `appointment.service.ts`
- Verifique se CORS está configurado no backend
- Abra DevTools (F12) → Console para ver o erro exato

### SSE (Real-time Updates) não funciona
- Alguns proxies bloqueiam Server-Sent Events
- Teste em modo incógnito (pode ser cache do navegador)
- Se persistir, implemente WebSocket como alternativa

---

## 📚 Próximos Passos

1. ✅ Agora você tem um app MERN em produção!
2. 🔄 Todo `git push` vai automaticamente fazer deploy em Railway + Vercel
3. 📊 Monitore logs no Railway dashboard
4. 🔐 Configure autenticação de usuários (próxima feature)
5. 💪 Escalabilidade: quando precisar de mais recursos, é só pagar!

---

## 📞 Suporte

Se tiver dúvidas específicas, consulte:
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
