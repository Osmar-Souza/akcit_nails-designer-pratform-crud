# 🎯 SETUP RÁPIDO - Começar Aqui

Bem-vindo! Escolha seu próximo passo:

## 🏠 Opção 1: Rodar Localmente (Recomendado para testes)

Quer testar o app antes de fazer deploy?

```bash
npm install
npm start
```

**Detalhes completos:** Leia [LOCAL-SETUP.md](./LOCAL-SETUP.md)

---

## 🚀 Opção 2: Deploy em Produção (100% Grátis!)

Quer colocar online?

**Serviços gratuitos:**
- ✅ **MongoDB Atlas** - Banco de dados (5GB grátis)
- ✅ **Railway** - Backend Node.js (créditos gratuitos)
- ✅ **Vercel** - Frontend Angular (grátis ilimitado)

**Detalhes completos:** Leia [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

---

## 📋 O que você recebeu?

Seu projeto foi atualizado com:

### Backend (`backend/`)
- ✅ Migrado de dados em memória para **MongoDB**
- ✅ Adicionar `mongoose` e `dotenv` em `package.json`
- ✅ Arquivo `.env.example` com variáveis de exemplo
- ✅ Arquivo `.gitignore` para segurança

### Frontend (`src/app/`)
- ✅ `appointment.service.ts` atualizado para usar URL dinâmica
- ✅ Funciona em localhost e em produção automaticamente

### Configurações de Deploy
- ✅ `vercel.json` - Config para Vercel
- ✅ `railway.json` - Config para Railway

---

## 🤔 Primeira Vez?

1. **Comece testando localmente:**
   - Leia [LOCAL-SETUP.md](./LOCAL-SETUP.md)
   - Rode `npm start`
   - Teste criar agendamentos

2. **Depois, faça deploy:**
   - Leia [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
   - Configure MongoDB Atlas
   - Deploy no Railway + Vercel
   - Compartilhe a URL com outros!

---

## 💡 Quick Start (Para corajosos 😎)

Se já sabe o que está fazendo:

```bash
# 1. Backend local com MongoDB
cd backend
npm install
npm start

# 2. Em outro terminal, frontend
npm install
npm start
```

Acesse `http://localhost:4200` ✨

---

## 📚 Documentação Completa

- [LOCAL-SETUP.md](./LOCAL-SETUP.md) - Rodar localmente com MongoDB
- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - Deploy em produção (grátis)
- [backend/package.json](./backend/package.json) - Dependencies do backend
- [backend/.env.example](./backend/.env.example) - Variáveis de ambiente

---

## ❓ Perguntas Frequentes

**P: Preciso pagar para rodar isso?**
R: Não! MongoDB Atlas (5GB grátis), Railway (créditos grátis), Vercel (grátis). Total: **$0/mês** 💰

**P: Meus dados vão ser perdidos?**
R: Não! Com MongoDB, os dados persistem mesmo após reiniciar o servidor.

**P: Posso usar outro banco de dados?**
R: Sim! O código está pronto para qualquer banco MongoDB-compatible (Supabase, AWS DocumentDB, etc.)

---

## 🆘 Precisa de Ajuda?

- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)
- Railway: [docs.railway.app](https://docs.railway.app/)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Angular: [angular.io](https://angular.io/)

---

**Escolha seu caminho acima e comece! 🚀**
