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
# Akcit Nails Designer Platform CRUD

Plataforma acadêmica de agendamento para salão de beleza. O sistema permite consultar e criar agendamentos, oferece uma área administrativa com métricas e transmite alterações da agenda em tempo real.

## Discovery

### Escopo e nível da visão

Esta documentação apresenta uma visão de containers inspirada no C4 e uma sequência da jornada de criação de agendamento. O sistema é um MVP para um único salão, com frontend web, API backend e banco de dados relacional.

O fluxo coberto inclui autenticação por perfil, consulta e criação de agendamentos, verificação de disponibilidade e atualização da agenda via Server-Sent Events (SSE). O dashboard calcula métricas no frontend a partir dos agendamentos recebidos.

### Responsabilidades e limites

- **Frontend Angular:** interface de login, agenda, formulário de criação e dashboard. Mantém o catálogo de serviços e apresenta os dados fornecidos pela API.
- **Backend Express.js:** autentica usuários com JWT, valida operações de agendamento, verifica conflitos, aplica restrição administrativa para atualização de status e exclusão e publica mudanças via SSE.
- **PostgreSQL:** persiste os agendamentos. A tabela é criada pelo backend na inicialização se ainda não existir.
- **Usuário cliente:** consulta a agenda disponível e solicita a criação de agendamentos.
- **Usuário administrador:** consulta o dashboard e pode atualizar o status ou excluir agendamentos.

Não há integração com gateway de pagamento, calendário externo, serviço de notificações ou provedor de IA. O assistente exibido na interface é apenas um placeholder.

### Integrações e restrições conhecidas

- O frontend comunica-se com o backend por HTTP/JSON; os eventos da agenda são entregues por SSE.
- O backend usa PostgreSQL por meio do pacote `pg`; `DATABASE_URL` configura a conexão.
- O login retorna um JWT com validade de quatro horas. As contas disponíveis são de demonstração e estão definidas no código.
- A disponibilidade é calculada em intervalos de uma hora, entre 08:00 e 18:00. A duração dos serviços varia entre 60, 120 e 180 minutos.
- A criação usa transação serializável e responde com conflito quando o horário não está disponível.
- O catálogo e os preços dos serviços estão definidos no frontend; o backend mantém os identificadores e durações usados na validação.

### Lacunas que exigem decisão

- Definir se clientes devem consultar apenas os próprios agendamentos. Atualmente, a API autenticada retorna a agenda completa e os registros não possuem vínculo com uma conta de cliente.
- Esclarecer a diferença entre cancelar e excluir. A interface chama de “Cancelar” uma ação de exclusão, embora a API aceite o status `Cancelado`.
- Definir fuso horário, dias de funcionamento, feriados, antecedência mínima e política para reagendamento.
- Definir política de credenciais, segredo JWT, proteção contra abuso e requisitos de produção. As credenciais e o segredo padrão atuais são apenas para demonstração/desenvolvimento.
- Definir persistência de usuários, múltiplos salões, paginação, observabilidade e política de retenção de dados.

## Diagrama estrutural

Visão dos principais containers e da comunicação entre eles:
Fonte Mermaid: [docs/diagrama-estrutural.mmd](docs/diagrama-estrutural.mmd).

```mermaid
flowchart LR
    actor["Cliente ou administrador"]
    frontend["Frontend web<br/>Angular 21"]
    backend["API e autenticação<br/>Express.js + JWT"]
    database[("PostgreSQL<br/>agendamentos")]

    actor --> frontend
    frontend -->|"HTTP/JSON com Bearer JWT"| backend
    frontend -->|"SSE /stream com token"| backend
    backend -->|"SQL via pg"| database
```

Não há serviços externos no escopo atual. O frontend e o backend mantêm informações do catálogo de serviços, portanto os identificadores e durações precisam permanecer consistentes entre as duas partes.

## Diagrama comportamental

Jornada crítica: cliente autenticado solicita um horário. O backend valida a solicitação e rejeita conflitos antes de persistir o agendamento.
Fonte Mermaid: [docs/diagrama-sequencia.mmd](docs/diagrama-sequencia.mmd).

```mermaid
sequenceDiagram
    actor Cliente
    participant Frontend as Angular
    participant API as Express API
    participant DB as PostgreSQL
    participant SSE as Clientes conectados por SSE

    Cliente->>Frontend: Preenche nome, serviço e horário
    Frontend->>API: POST /appointments com Bearer JWT
    API->>API: Valida token, campos, serviço, data e status
    API->>DB: Inicia transação serializável
    API->>DB: Verifica conflito pela duração do serviço
    alt Horário em conflito
        API->>DB: Rollback
        API-->>Frontend: 409 Horário indisponível
    else Horário disponível
        API->>DB: Insere agendamento e confirma transação
        API->>DB: Consulta agenda atualizada
        API-->>SSE: Publica agenda atualizada
        API-->>Frontend: 201 Agendamento criado
    end
```

## Funcionalidades

- Login de demonstração com perfis de administrador e cliente.
- Agenda com criação, consulta e atualização em tempo real via SSE.
- Consulta de disponibilidade conforme serviço e duração.
- Dashboard administrativo com contagens, próximos agendamentos e cálculos de receita.
- Atualização de status e exclusão restritas ao administrador.
- Assistente de IA placeholder, sem integração externa.

## Tecnologias

- Angular 21, TypeScript, RxJS, HTML e CSS.
- Express.js, Node.js, `jsonwebtoken`, `pg`, `cors` e `dotenv`.
- PostgreSQL para persistência.
- Server-Sent Events para atualização da agenda.

## Como executar localmente

1. Clone o repositório:

```bash
git clone https://github.com/Osmar-Souza/akcit_nails-designer-pratform-crud.git
cd akcit_nails-designer-pratform-crud
```

2. Instale as dependências do frontend e do backend:

```bash
npm install
npm run install:backend
```

3. Configure o PostgreSQL. Por padrão, o backend tenta conectar a `postgresql://postgres:postgres@localhost:5432/akcit`. Para outro ambiente, defina `DATABASE_URL`. Também é possível definir `JWT_SECRET`; o segredo padrão serve somente para desenvolvimento.

4. Inicie o backend:

```bash
npm run start:backend
```

5. Em outra janela de terminal, inicie o frontend:

```bash
npm start
```

6. Acesse `http://localhost:4200`.

O backend usa a porta definida em `PORT` ou, por padrão, `3333`. As contas de demonstração são `admin` / `admin123` e `client` / `client123`; não devem ser usadas em produção.

## API

As rotas protegidas exigem `Authorization: Bearer <token>`, exceto o login. O endpoint SSE recebe o token pela query string para compatibilidade com `EventSource`.

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/login` | Público | Valida credenciais de demonstração e retorna token e perfil. |
| `GET` | `/appointments` | Autenticado | Retorna a agenda completa ordenada por data. |
| `GET` | `/availability?date=YYYY-MM-DD&serviceId=1` | Autenticado | Retorna horários de hora em hora e sua disponibilidade. |
| `POST` | `/appointments` | Autenticado | Valida e cria agendamento; pode retornar `409` em conflito. |
| `PATCH` | `/appointments/:id/status` | Administrador | Atualiza o status do agendamento. |
| `DELETE` | `/appointments/:id` | Administrador | Exclui o agendamento. |
| `GET` | `/stream` | Autenticado | Envia a agenda inicial e as atualizações subsequentes via SSE. |

Exemplo de criação:

```http
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "clientName": "João Silva",
  "serviceId": "1",
  "date": "2026-05-10T14:00:00Z",
  "status": "Agendado"
}
```

## Testes

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
    appointment.service.ts
    auth.service.ts
    constants.ts
    types.ts
backend/
  server.js
  package.json
```

## Decisões e ajustes da documentação

- Os diagramas representam a arquitetura existente em nível de containers, sem inventar microsserviços ou integrações externas.
- O fluxo de sequência destaca a validação de conflito e a transação serializável, pois são regras efetivamente implementadas.
- O SSE foi documentado como atualização da agenda, e não como canal de comandos: as mutações continuam ocorrendo pela API REST.
- As contas de login são tratadas como demonstração; não representam um sistema de identidade pronto para produção.
- Foram explicitadas lacunas de autorização por cliente, cancelamento versus exclusão, calendário e operação, em vez de presumir decisões ainda não tomadas.

## Licença

Uso acadêmico e de estudo.

