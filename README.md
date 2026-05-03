# Akcit Nails Designer Platform CRUD

Aplicação frontend em Angular para gerenciamento de agendamentos de um salão de beleza.

## Funcionalidades

- ✅ Autenticação de tela de login com diferentes perfis (admin e cliente)
- ✅ Dashboard com dados reais e atualização em tempo real via SSE
- ✅ Listagem de agendamentos com filtros por perfil
- ✅ Criação de novos agendamentos com validação
- ✅ Exclusão instantânea de agendamentos
- ✅ Atualização de status de agendamentos (Agendado → Concluído/Cancelado)
- ✅ Metricas de faturamento (realizado e previsão futura)
- ✅ Distribuição de status dos agendamentos
- ✅ Lista de próximos agendamentos
- ✅ Receita por serviço concluído
- ✅ Layout responsivo e otimizado para desktop
- 🔄 Componente de assistente de IA como base de extensão futura

## Tecnologias utilizadas

- Angular 21
- TypeScript
- HTML5 / CSS3
- Tailwind CSS (configuração de estilos)
- UUID para geração de identificadores

## Como executar localmente

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITÓRIO>
cd akcit_nails-designer-pratform-crud
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o backend em outra janela de terminal:

```bash
npm run install:backend
npm run start:backend
```

4. Inicie a aplicação:

```bash
npm start
```

5. Abra no navegador:

```text
http://localhost:4200
```

## Como executar os testes

```bash
npm test
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
README.md
```

## Backend

O projeto inclui um servidor Express.js com API REST para gerenciamento de agendamentos e atualização em tempo real:

- **GET /appointments**: Lista todos os agendamentos
- **POST /appointments**: Cria um novo agendamento
- **PATCH /appointments/:id/status**: Atualiza o status de um agendamento
- **DELETE /appointments/:id**: Remove um agendamento
- **GET /stream**: Endpoint SSE para atualizações em tempo real

O backend usa banco de dados em memória para desenvolvimento rápido. Todas as mudanças são transmitidas via SSE para sincronização instantânea entre clientes.

## Limitações

- O backend usa banco de dados em memória (dados são perdidos ao reiniciar o servidor).
- Autenticação é apenas de front-end (sem validação backend real).
- O assistente de IA é um componente placeholder sem integração.
- Sem paginação na lista de agendamentos (pode ficar lenta com muitos dados).
- Sem suporte a múltiplos salões ou usuários persistentes.

## Próximos passos

- Migrar para um banco de dados persistente (SQLite, PostgreSQL, MongoDB).
- Implementar autenticação real com JWT no backend.
- Adicionar confirmação antes de deletar agendamentos.
- Conectar o assistente de IA a um serviço real (GenAI, OpenAI, etc.).
- Implementar paginação e busca avançada de agendamentos.
- Adicionar relatórios e exportação de dados (PDF, CSV).
- Implementar notificações por email/SMS para agendamentos.
- Suporte a múltiplos salões com gerenciamento de usuários.
- Deploy em produção (Vercel, Heroku, etc.).

## Recursos Técnicos

### Atualização em Tempo Real

A aplicação usa **Server-Sent Events (SSE)** para sincronização instantânea entre clientes:
- Quando um agendamento é criado, deletado ou alterado, todos os clientes conectados recebem a atualização imediatamente
- O dashboard reflete as mudanças sem necessidade de refresh
- Implementado via RxJS BehaviorSubject e async pipe do Angular

### Optimistic Updates

As operações (criar, deletar, atualizar) são atualizadas imediatamente na UI local, enquanto a requisição backend é processada:
- Melhor UX com feedback instantâneo
- Fallback para dados anterior caso a requisição falhe

### Filtros por Perfil

- **Admin**: vê todos os agendamentos (agendados, concluídos, cancelados)
- **Cliente**: vê apenas agendamentos pendentes de conclusão

## Licença

Uso acadêmico e de estudo.
