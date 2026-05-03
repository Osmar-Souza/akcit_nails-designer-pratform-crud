# Akcit Nails Designer Platform CRUD

Plataforma de agendamento para salão de beleza com frontend em Angular e backend em Express.js. O sistema oferece login por perfil, dashboard de métricas, CRUD de agendamentos e atualização em tempo real.

## Descrição

Este projeto é um MVP acadêmico para gerenciamento de agendamentos de salão. O frontend exibe um painel administrativo completo, enquanto o backend entrega as APIs REST e sincronização instantânea usando Server-Sent Events (SSE).

## Funcionalidades

- ✅ Login com perfis de admin e cliente
- ✅ Dashboard com métricas reais
- ✅ Atualização em tempo real via SSE
- ✅ Listagem de agendamentos
- ✅ Filtro por perfil de usuário
- ✅ Criação de agendamentos
- ✅ Exclusão instantânea de agendamentos
- ✅ Atualização de status (Agendado → Concluído / Cancelado)
- ✅ Cálculo de faturamento realizado e previsão futura
- ✅ Receita por serviço concluído
- ✅ Próximos agendamentos ordenados por data
- ✅ Layout responsivo e otimizado para desktop
- 🔄 Assistente de IA placeholder para evolução futura

## Tecnologias utilizadas

- Angular 21
- TypeScript
- HTML5 / CSS3
- Tailwind CSS
- RxJS
- Express.js
- Server-Sent Events (SSE)
- UUID

## Como executar localmente

1. Clone o repositório:

```bash
git clone https://github.com/Osmar-Souza/akcit_nails-designer-pratform-crud.git
cd akcit_nails-designer-pratform-crud
```

2. Instale as dependências do frontend:

```bash
npm install
```

3. Instale as dependências do backend:

```bash
npm run install:backend
```

4. Inicie o backend:

```bash
npm run start:backend
```

5. Inicie o frontend em outra janela de terminal:

```bash
npm start
```

6. Acesse a aplicação:

```text
http://localhost:4200
```

## Como executar os testes

```bash
npm test
```

## Exemplo de uso

### Criar agendamento

```http
POST /appointments
Content-Type: application/json

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "clientName": "João Silva",
  "serviceId": "1",
  "date": "2026-05-10T14:00:00Z",
  "status": "Agendado"
}
```

### Atualizar status

```http
PATCH /appointments/123e4567-e89b-12d3-a456-426614174000/status
Content-Type: application/json

{
  "status": "Concluído"
}
```

### Deletar agendamento

```http
DELETE /appointments/123e4567-e89b-12d3-a456-426614174000
```

### Conectar SSE

```http
GET /stream
```

## Estrutura do projeto

```text
src/
  app/
    ai-assistant/
    appointment-list/
    dashboard/
    layout/
    login-screen/
    new-booking-modal/
    app.component.*
    appointment.service.ts
    constants.ts
    types.ts
  index.html
  main.ts
backend/
  server.js
  package.json
angular.json
package.json
tsconfig.json
tsconfig.app.json
tsconfig.spec.json
```

## Backend

API REST em Express.js que gerencia os agendamentos e transmite atualizações em tempo real:

- **GET /appointments**: lista todos os agendamentos
- **POST /appointments**: cria um novo agendamento
- **PATCH /appointments/:id/status**: atualiza o status de um agendamento
- **DELETE /appointments/:id**: remove um agendamento
- **GET /stream**: envia atualizações via SSE

O backend utiliza armazenamento em memória para facilitar o desenvolvimento rápido.

## Limitações

- Armazenamento em memória, então os dados são perdidos ao reiniciar o servidor
- Autenticação simulada no frontend, sem validação real no backend
- Assistente de IA sem integração com serviços externos
- Falta paginação e filtros avançados para a lista de agendamentos
- Sem suporte a múltiplos salões e usuários persistentes

## Próximos passos

- Migrar para banco de dados persistente (SQLite, PostgreSQL, MongoDB)
- Implementar autenticação real com JWT
- Adicionar confirmação antes de deletar agendamentos
- Conectar o assistente de IA a um serviço real (GenAI / OpenAI)
- Implementar busca, filtros e paginação
- Adicionar relatórios e exportação de dados (PDF / CSV)
- Inserir notificações por email / SMS
- Suporte a múltiplos salões e usuários
- Deploy em produção (Vercel, Heroku, etc.)

## Licença

Uso acadêmico e de estudo.

