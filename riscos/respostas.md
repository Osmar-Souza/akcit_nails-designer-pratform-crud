# Respostas Técnicas e Mitigação

## Risco 1: Autenticação e autorização fracas
- Estratégia:
  - Implementar autenticação real com login por senha e credenciais armazenadas com hash no backend.
  - Remover credenciais hardcoded do código.
- Ações:
  - Alterar `backend/server.js` para usar usuários no banco ou serviço de identidade.
  - Substituir `src/app/login-screen/login-screen.component.ts` por formulário real com usuário/senha.
  - Adicionar rota de logout e expiração segura de token.
  - Usar `HttpOnly` cookies ou outra camada de proteção para reduzir o risco de token roubado.
- Resultado:
  - Controle de acesso consistente, menor chance de acesso indevido e credenciais menos vulneráveis.

## Risco 2: Validação insuficiente de agendamento no frontend
- Estratégia:
  - Fortalecer validação de dados em camada dupla: frontend e backend.
- Ações:
  - Em `src/app/new-booking-modal/new-booking-modal.component.ts`, validar:
    - `date` futura,
    - `serviceId` existente,
    - não permitir datas passadas,
    - e avisar duplicidade antes do envio.
  - No backend `backend/server.js`, adicionar validação estruturada com `express-validator` ou esquema (`zod`/`joi`) e devolver erros claros.
- Resultado:
  - Menos agendamentos inválidos e menos falhas de operação em produção.

## Risco 3: Tratamento de erros e feedback inexistentes
- Estratégia:
  - Criar camada de erros centralizada e mensagens de usuário claras.
- Ações:
  - Em `src/app/appointment.service.ts`, capturar erros e transformar em notificações visuais.
  - Em `src/app/app.component.ts`, exibir alertas de login/falha com uma mensagem legível.
  - No backend `backend/server.js`, padronizar respostas de erro com status HTTP e corpo `{ error: '...' }`.
- Resultado:
  - Usuários entendem falhas, conseguem reagir e o time diminui o retrabalho.

## Risco 4: Concorrência e disponibilidade de agendamentos
- Estratégia:
  - Garantir integridade de agendamento no banco e sincronizar disponibilidade.
- Ações:
  - Adicionar constraint ou mecanismo de exclusão por intervalo no PostgreSQL.
  - Em `backend/server.js`, usar transação com lock explícito ou retry mais robusto para `POST /appointments`.
  - Atualizar `GET /availability` para validar slots no backend sempre que possível e reduzir janela de stale data.
- Resultado:
  - Menos agendamentos sobrepostos, agenda mais confiável e menor perda por conflitos de horário.
