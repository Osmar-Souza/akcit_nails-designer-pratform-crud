# 🏠 Setup Local - Rodando tudo na máquina

Siga este guia para testar o app localmente antes de fazer deploy.

## 📦 Pré-requisitos

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Passo a Passo

### 1. Instalar PostgreSQL Localmente

#### Windows:
1. Baixe o instalador em: https://www.postgresql.org/download/windows/
2. Execute o instalador e siga os passos
3. Defina um usuário e senha (por exemplo `postgres` / `postgres`)
4. Anote a porta (padrão: `5432`)

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Criar banco de dados PostgreSQL

#### Windows / macOS / Linux:
```bash
createdb akcit
```

Se o comando `createdb` não existir, use:
```bash
psql -U postgres -c "CREATE DATABASE akcit;"
```

### 3. Instalar dependências do Backend

```bash
cd backend
npm install
```

### 4. Criar arquivo `.env` no backend

Crie `backend/.env` com estas variáveis:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:325498@localhost:5432/akcit
NODE_ENV=development
```

> Se você usou outras credenciais, substitua `postgres:postgres` pelos seus valores.

### 5. Rodar Backend

```bash
# Dentro da pasta backend/
npm start
```

Você deve ver algo como:
```
✅ Backend Akcit rodando em http://localhost:3333
📦 Usando PostgreSQL: postgresql://postgres:postgres@localhost:5432/akcit
```

### 6. Em outro terminal, instalar dependências do Frontend

```bash
# Na raiz do projeto
npm install
```

### 7. Rodar Frontend

```bash
npm start
```

O app deve abrir em `http://localhost:4200` e funcionar normalmente.

### 8. Testar no navegador

1. Abra `http://localhost:4200`
2. Crie um novo agendamento
3. Verifique se aparece no dashboard
4. Recarregue a página - os dados devem permanecer no PostgreSQL

---

## ✅ Verificar se Tudo Funciona

Abra DevTools (F12) e vá no Console. Não deve haver erros de conexão.

Se der erro, verifique:
```bash
# Backend está rodando?
curl http://localhost:3333/appointments

# PostgreSQL está rodando?
psql -U postgres -c "SELECT 1;"
```

---

## 🔄 Scripts Úteis

```bash
# Ver dados do PostgreSQL
psql -U postgres -d akcit -c "SELECT * FROM appointments;"

# Limpar tabela local (CUIDADO!)
psql -U postgres -d akcit -c "DELETE FROM appointments;"
```

---

## 📝 Próximo Passo

Quando estiver tudo funcionando localmente:
- ➡️ Siga o [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) para fazer deploy em produção
